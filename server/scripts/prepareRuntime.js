const path = require("path");
const dotenv = require("dotenv");
const { execFileSync } = require("child_process");
const net = require("net");
const mongoose = require("mongoose");

const envPath = path.resolve(__dirname, "..", ".env");
const envResult = dotenv.config({ path: envPath, quiet: true });

if (envResult.error && envResult.error.code !== "ENOENT") {
  throw envResult.error;
}

const DEFAULT_PORT = 5001;
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_WAIT_MS = 5000;
const DEFAULT_DATABASE_URL = "mongodb://127.0.0.1:27017";
const DEFAULT_DATABASE_NAME = "PremiumEstateDB";
const DEFAULT_MONGO_PREFLIGHT_TIMEOUT_MS = 3000;
const POLL_INTERVAL_MS = 250;

const normalizePort = (value, fallback = DEFAULT_PORT) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeMilliseconds = (value, fallback = DEFAULT_WAIT_MS) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeBoolean = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  const normalized = String(value).trim().toLowerCase();

  if (["1", "true", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["0", "false", "no", "off"].includes(normalized)) {
    return false;
  }

  return fallback;
};

const port = normalizePort(process.env.PORT);
const host = String(process.env.HOST || DEFAULT_HOST).trim() || DEFAULT_HOST;
const autoFreePort = normalizeBoolean(process.env.AUTO_FREE_PORT, true);
const forceKillPort = normalizeBoolean(process.env.AUTO_FREE_PORT_FORCE, true);
const waitTimeoutMs = normalizeMilliseconds(process.env.AUTO_FREE_PORT_WAIT_MS);
const databaseUrl = String(process.env.DB_URL || DEFAULT_DATABASE_URL).trim() || DEFAULT_DATABASE_URL;
const databaseName = String(process.env.DB || DEFAULT_DATABASE_NAME).trim() || DEFAULT_DATABASE_NAME;
const mongoPreflightTimeoutMs = normalizeMilliseconds(
  process.env.MONGO_PREFLIGHT_TIMEOUT_MS,
  DEFAULT_MONGO_PREFLIGHT_TIMEOUT_MS
);
const skipMongoPreflight = normalizeBoolean(process.env.SKIP_MONGO_PREFLIGHT, false);

const executeCommand = (command, args) => {
  try {
    return execFileSync(command, args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch (error) {
    if (error.code === "ENOENT") {
      return null;
    }

    const stdout = error.stdout?.toString().trim();
    if (stdout) {
      return stdout;
    }

    return null;
  }
};

const uniqueIntegers = (values) => [...new Set(values.filter((value) => Number.isInteger(value)))];

const parsePidList = (output) =>
  uniqueIntegers(
    String(output || "")
      .split(/\s+/)
      .filter((value) => /^\d+$/.test(value))
      .map((value) => Number.parseInt(value, 10))
  );

const findListeningPidsWithLsof = () => {
  const output = executeCommand("lsof", ["-nP", "-iTCP:" + port, "-sTCP:LISTEN", "-t"]);
  return output === null ? null : parsePidList(output);
};

const findListeningPidsWithFuser = () => {
  const output = executeCommand("fuser", [`${port}/tcp`]);
  return output === null ? null : parsePidList(output);
};

const findListeningPidsWithSs = () => {
  const output = executeCommand("ss", ["-ltnp", `( sport = :${port} )`]);
  if (output === null) {
    return null;
  }

  const pidMatches = [...output.matchAll(/pid=(\d+)/g)];
  return uniqueIntegers(pidMatches.map((match) => Number.parseInt(match[1], 10)));
};

const findListeningPids = () => {
  const resolvers = [findListeningPidsWithLsof, findListeningPidsWithFuser, findListeningPidsWithSs];

  for (const resolver of resolvers) {
    const pids = resolver();
    if (Array.isArray(pids)) {
      return pids.filter((pid) => pid !== process.pid && pid !== process.ppid);
    }
  }

  return [];
};

const getProcessInfo = (pid) => {
  const output = executeCommand("ps", ["-p", String(pid), "-o", "pid=", "-o", "ppid=", "-o", "user=", "-o", "command="]);
  if (!output) {
    return {
      pid,
      ppid: null,
      user: null,
      command: "unknown",
    };
  }

  const [rawPid, rawPpid, rawUser, ...commandParts] = output.trim().split(/\s+/);

  return {
    pid: Number.parseInt(rawPid, 10) || pid,
    ppid: Number.parseInt(rawPpid, 10) || null,
    user: rawUser || null,
    command: commandParts.join(" ") || "unknown",
  };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sanitizeConnectionString = (value) =>
  String(value || "").replace(/\/\/([^@/]+)@/, "//***@");

const formatMongoEndpoint = () => `${sanitizeConnectionString(databaseUrl)} (db=${databaseName})`;

const collectMongoErrorDetails = (error) => {
  const visited = new Set();
  const queue = [error];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current || typeof current !== "object" || visited.has(current)) {
      continue;
    }

    visited.add(current);

    if (current.code || current.address || current.port || current.syscall) {
      return current;
    }

    if (current.cause) {
      queue.push(current.cause);
    }

    if (current.reason) {
      queue.push(current.reason);
    }

    if (current.errors && typeof current.errors === "object") {
      queue.push(...Object.values(current.errors));
    }

    if (current.servers && typeof current.servers.values === "function") {
      for (const serverDescription of current.servers.values()) {
        if (serverDescription?.error) {
          queue.push(serverDescription.error);
        }
      }
    }
  }

  return error;
};

const extractMongoErrorCode = (error, details) => {
  const codeFromDetails = typeof details?.code === "string" ? details.code : null;
  if (codeFromDetails) {
    return codeFromDetails;
  }

  const codeFromError = typeof error?.code === "string" ? error.code : null;
  if (codeFromError) {
    return codeFromError;
  }

  const match = String(error?.message || "").match(/\b(E[A-Z0-9_]+)\b/);
  return match ? match[1] : null;
};

const getMongoDiagnosticsHints = (errorCode) => {
  if (errorCode === "ECONNREFUSED") {
    return [
      "MongoDB не принимает соединения. Для локальной разработки запустите `npm run db:up` из корня репозитория или поднимите mongod вручную.",
      "Проверьте, что DB_URL указывает на правильный host:port в server/.env.",
    ];
  }

  if (errorCode === "ENOTFOUND" || errorCode === "EAI_AGAIN") {
    return [
      "Имя хоста из DB_URL не резолвится. Проверьте DNS, VPN и опечатки в адресе.",
      "Если MongoDB локальная, используйте localhost или 127.0.0.1 в DB_URL.",
    ];
  }

  if (errorCode === "ETIMEDOUT") {
    return [
      "MongoDB не отвечает вовремя. Проверьте firewall, сетевую доступность и нагрузку на узел.",
      "Если это удалённая база, убедитесь, что текущая сеть имеет доступ к MongoDB.",
    ];
  }

  if (errorCode === "EPERM") {
    return [
      "Операционная система или sandbox запрещает исходящее соединение. Проверьте firewall, SELinux/AppArmor и контейнерные сетевые политики.",
      "Если приложение запущено в CI, dev-container или sandbox, убедитесь, что ему разрешён доступ к MongoDB.",
    ];
  }

  if (errorCode === "MongoServerSelectionError") {
    return [
      "Драйвер не смог выбрать доступный MongoDB endpoint. Проверьте replica set, DNS и параметры TLS.",
    ];
  }

  return [
    "Проверьте DB_URL, доступность MongoDB и сетевой путь до неё.",
    "Если база временно недоступна, сервер всё равно поднимется и продолжит фоновые reconnect-попытки.",
  ];
};

const logMongoPreflightWarning = (error) => {
  const details = collectMongoErrorDetails(error);
  const errorCode = extractMongoErrorCode(error, details);
  const errorIdentifier = errorCode || error.name;
  const diagnostics = [
    errorCode ? `code=${errorCode}` : null,
    details?.syscall ? `syscall=${details.syscall}` : null,
    details?.address ? `address=${details.address}` : null,
    details?.port ? `port=${details.port}` : null,
  ].filter(Boolean);

  console.warn(
    `[prepareRuntime] MongoDB preflight warning: не удалось подключиться к ${formatMongoEndpoint()}.`
  );
  console.warn(
    `[prepareRuntime] ${error.name || "Error"}: ${error.message}${
      diagnostics.length ? ` (${diagnostics.join(", ")})` : ""
    }`
  );
  console.warn(
    "[prepareRuntime] Сервер продолжит запуск в degraded mode: /health/live останется доступен, а /health/ready и database-backed /api routes будут отвечать 503 до восстановления MongoDB."
  );

  for (const hint of getMongoDiagnosticsHints(errorIdentifier)) {
    console.warn(`[prepareRuntime] Подсказка: ${hint}`);
  }
};

const runMongoPreflight = async () => {
  if (skipMongoPreflight) {
    console.info("[prepareRuntime] MongoDB preflight пропущен: SKIP_MONGO_PREFLIGHT=true.");
    return;
  }

  const probeClient = new mongoose.Mongoose();

  try {
    await probeClient.connect(databaseUrl, {
      dbName: databaseName,
      serverSelectionTimeoutMS: mongoPreflightTimeoutMs,
      connectTimeoutMS: mongoPreflightTimeoutMs,
      socketTimeoutMS: mongoPreflightTimeoutMs,
      maxPoolSize: 1,
      minPoolSize: 0,
    });

    const connectedHost = probeClient.connection.host || "unknown-host";
    const connectedPort = probeClient.connection.port || "unknown-port";
    const connectedDatabase = probeClient.connection.name || databaseName;

    console.info(
      `[prepareRuntime] MongoDB preflight ok: ${connectedHost}:${connectedPort}/${connectedDatabase}.`
    );
  } catch (error) {
    logMongoPreflightWarning(error);
  } finally {
    await probeClient.disconnect().catch(() => undefined);
  }
};

const probePortAvailability = () =>
  new Promise((resolve, reject) => {
    const probeServer = net.createServer();

    probeServer.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(false);
        return;
      }

      reject(error);
    });

    probeServer.once("listening", () => {
      probeServer.close((closeError) => {
        if (closeError) {
          reject(closeError);
          return;
        }

        resolve(true);
      });
    });

    probeServer.listen(port, host);
  });

const isPortFree = async () => {
  const probeResult = await probePortAvailability();
  if (!probeResult) {
    return false;
  }

  return findListeningPids().length === 0;
};

const waitUntilPortIsFree = async (timeoutMs) => {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isPortFree()) {
      return true;
    }

    await sleep(POLL_INTERVAL_MS);
  }

  return isPortFree();
};

const sendSignal = (pid, signal) => {
  try {
    process.kill(pid, signal);
    return true;
  } catch (error) {
    if (error.code === "ESRCH") {
      return true;
    }

    console.error(
      `[prepareRuntime] Не удалось отправить ${signal} процессу ${pid}: ${error.message}`
    );
    return false;
  }
};

const logOccupiedPort = (processes) => {
  console.warn(`[prepareRuntime] Порт ${host}:${port} уже занят.`);
  for (const processInfo of processes) {
    console.warn(
      `[prepareRuntime] PID=${processInfo.pid} USER=${processInfo.user || "unknown"} CMD=${processInfo.command}`
    );
  }
};

const terminatePortOwners = async () => {
  const initialPids = findListeningPids();
  const portIsBusy = !(await probePortAvailability());

  if (!portIsBusy) {
    return;
  }

  if (!initialPids.length) {
    throw new Error(
      `Порт ${port} занят, но не удалось определить PID через lsof/fuser/ss. Освободите порт вручную или установите lsof.`
    );
  }

  const initialProcesses = initialPids.map(getProcessInfo);
  logOccupiedPort(initialProcesses);

  if (!autoFreePort) {
    throw new Error(
      `Порт ${port} занят, а AUTO_FREE_PORT=false. Освободите порт вручную или смените PORT в server/.env`
    );
  }

  for (const processInfo of initialProcesses) {
    console.warn(`[prepareRuntime] Отправляю SIGTERM процессу ${processInfo.pid}...`);
    sendSignal(processInfo.pid, "SIGTERM");
  }

  if (await waitUntilPortIsFree(waitTimeoutMs)) {
    console.warn(`[prepareRuntime] Порт ${port} освобождён после SIGTERM.`);
    return;
  }

  if (!forceKillPort) {
    throw new Error(
      `Порт ${port} не освободился за ${waitTimeoutMs}мс после SIGTERM.`
    );
  }

  const remainingPids = findListeningPids();
  const remainingProcesses = remainingPids.map(getProcessInfo);

  for (const processInfo of remainingProcesses) {
    console.warn(`[prepareRuntime] Процесс ${processInfo.pid} не завершился. Отправляю SIGKILL...`);
    sendSignal(processInfo.pid, "SIGKILL");
  }

  if (await waitUntilPortIsFree(waitTimeoutMs)) {
    console.warn(`[prepareRuntime] Порт ${port} освобождён после SIGKILL.`);
    return;
  }

  throw new Error(
    `Порт ${port} всё ещё занят после автоматической очистки. Проверьте systemd/pm2/docker и владельца порта вручную.`
  );
};

const main = async () => {
  await terminatePortOwners();
  await runMongoPreflight();
};

if (require.main === module) {
  main().catch((error) => {
    console.error(`[prepareRuntime] ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  collectMongoErrorDetails,
  extractMongoErrorCode,
  getMongoDiagnosticsHints,
  runMongoPreflight,
  terminatePortOwners,
  main,
};
