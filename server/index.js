const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, ".env");
const envResult = dotenv.config({ path: envPath, quiet: true });

if (envResult.error && envResult.error.code !== "ENOENT") {
  throw envResult.error;
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const db = require("./db/config");
const healthRoute = require("./controllers/health/_routes");
const route = require("./controllers/route");
const errorHandler = require("./middlewares/errorHandler");
const requireDatabase = require("./middlewares/requireDatabase");
const { auditLog } = require("./middlewares/auditLog");
const { initWebSocket, broadcast } = require("./services/websocket");
const {
  getDatabaseStatus,
  isDatabaseReady,
  markConnectionAttempt,
  markReady,
  markRetryScheduled,
  markTransportConnected,
  markUnavailable,
  setDatabaseConfig,
} = require("./utils/databaseState");

const isTestEnvironment =
  process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);
const IPV4_ADDRESS_PATTERN = /\b(?:\d{1,3}\.){3}\d{1,3}\b/;

const normalizePort = (value, fallback = 5001) => {
  const parsedPort = Number.parseInt(value, 10);

  if (Number.isInteger(parsedPort) && parsedPort >= 0) {
    return parsedPort;
  }

  return fallback;
};

const normalizeMilliseconds = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return fallback;
};

const allowedOrigins = [...new Set([
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.CLIENT_URL,
].filter(Boolean).map((value) => String(value).trim()))];

const isAllowedOrigin = (origin) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);

    return hostname === "localhost" || IPV4_ADDRESS_PATTERN.test(hostname);
  } catch {
    return false;
  }
};

const port = normalizePort(process.env.PORT);
const listenHost = String(process.env.HOST || "127.0.0.1").trim() || "127.0.0.1";
const databaseUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017";
const databaseName = process.env.DB || "PremiumEstateDB";
const databaseRetryBaseDelayMs = normalizeMilliseconds(process.env.DB_RETRY_BASE_DELAY_MS, 5000);
const databaseRetryMaxDelayMs = normalizeMilliseconds(process.env.DB_RETRY_MAX_DELAY_MS, 60000);

const app = express();
app.disable("x-powered-by");

setDatabaseConfig(databaseUrl, databaseName);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(compression());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 100 : 10000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 5 : 1000,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      const error = new Error("Not allowed by CORS");
      error.statusCode = 403;
      callback(error);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
    ],
    exposedHeaders: ["Access-Control-Allow-Origin", "X-Total-Count"],
  })
);
app.use("/health", healthRoute);
app.use("/api/health", healthRoute);
app.use("/api/user", authLimiter);
app.use("/api/user", auditLog);
app.use("/api/property", auditLog);
app.use("/api", requireDatabase, route);

app.get("/", (_req, res) => {
  res.status(isDatabaseReady() ? 200 : 503).json({
    service: "PremiumEstate CRM API",
    database: getDatabaseStatus(),
  });
});

app.use((_req, _res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

let server = null;
let startupPromise = null;
let databaseRetryTimer = null;
let databaseConnectionPromise = null;
let databaseEventsAttached = false;
let shutdownRequested = false;

const syncServerAddress = (activeServer) => {
  const addressInfo = activeServer?.address();

  if (!addressInfo || typeof addressInfo === "string") {
    return null;
  }

  const host = addressInfo.address === "::" ? "127.0.0.1" : addressInfo.address;
  app.set("host", host);
  app.set("port", addressInfo.port);

  return {
    host,
    port: addressInfo.port,
  };
};

const startServer = () => {
  if (isTestEnvironment) {
    return Promise.resolve(null);
  }

  if (server) {
    return Promise.resolve(server);
  }

  if (startupPromise) {
    return startupPromise;
  }

  startupPromise = new Promise((resolve, reject) => {
    const nextServer = app.listen(port, listenHost);

    const handleError = (error) => {
      nextServer.removeListener("listening", handleListening);
      startupPromise = null;
      reject(error);
    };

    const handleListening = () => {
      nextServer.removeListener("error", handleError);
      server = nextServer;
      initWebSocket(server);

      const addressInfo = syncServerAddress(server);
      if (addressInfo) {
        console.info(
          `PremiumEstate CRM API listening on http://${addressInfo.host}:${addressInfo.port}`
        );
      }

      startupPromise = Promise.resolve(server);
      resolve(server);
    };

    nextServer.once("error", handleError);
    nextServer.once("listening", handleListening);
  });

  return startupPromise;
};

const clearDatabaseRetryTimer = () => {
  if (!databaseRetryTimer) {
    return;
  }

  clearTimeout(databaseRetryTimer);
  databaseRetryTimer = null;
};

const calculateRetryDelayMs = (attempt) =>
  Math.min(databaseRetryBaseDelayMs * 2 ** Math.max(attempt - 1, 0), databaseRetryMaxDelayMs);

const attachDatabaseEventHandlers = () => {
  if (databaseEventsAttached) {
    return;
  }

  databaseEventsAttached = true;

  mongoose.connection.on("connected", () => {
    markTransportConnected();

    const { endpoint } = getDatabaseStatus();
    console.info(
      `MongoDB transport connected to ${endpoint.host || "unknown-host"}:${endpoint.port || "unknown-port"}`
    );
  });

  mongoose.connection.on("disconnected", () => {
    markUnavailable();
    console.warn("MongoDB disconnected. API will continue serving health endpoints and 503s.");
  });

  mongoose.connection.on("error", (error) => {
    markUnavailable(error);
    console.error("MongoDB connection error.", error);
  });
};

const scheduleDatabaseReconnect = (attempt, error) => {
  if (shutdownRequested || isTestEnvironment) {
    return;
  }

  clearDatabaseRetryTimer();

  const nextAttempt = attempt + 1;
  const retryDelayMs = calculateRetryDelayMs(nextAttempt);

  markRetryScheduled(nextAttempt, retryDelayMs, error);

  console.warn(
    `MongoDB unavailable. Retrying connection in ${retryDelayMs}ms (attempt ${nextAttempt}).`
  );

  databaseRetryTimer = setTimeout(() => {
    databaseRetryTimer = null;
    void connectToDatabase(nextAttempt);
  }, retryDelayMs);

  databaseRetryTimer.unref?.();
};

const connectToDatabase = async (attempt = 1) => {
  if (shutdownRequested || isTestEnvironment) {
    return null;
  }

  if (isDatabaseReady()) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    return databaseConnectionPromise || mongoose.connection;
  }

  if (databaseConnectionPromise) {
    return databaseConnectionPromise;
  }

  clearDatabaseRetryTimer();
  markConnectionAttempt();

  databaseConnectionPromise = db(databaseUrl, databaseName)
    .then((connection) => {
      markReady();
      console.info("MongoDB initialization complete. API is ready for database-backed traffic.");
      return connection;
    })
    .catch((error) => {
      markUnavailable(error);
      const { endpoint } = getDatabaseStatus();
      console.warn(
        `MongoDB initialization failed on attempt ${attempt} for ${
          endpoint.host || "unknown-host"
        }:${endpoint.port || "unknown-port"}. API will continue in degraded mode until reconnection succeeds.`
      );
      console.error(error);
      scheduleDatabaseReconnect(attempt, error);
      return null;
    })
    .finally(() => {
      databaseConnectionPromise = null;
    });

  return databaseConnectionPromise;
};

const closeDatabaseConnection = async () => {
  clearDatabaseRetryTimer();

  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.connection.close(false);
};

const closeServer = () =>
  Promise.resolve(startupPromise)
    .catch(() => undefined)
    .then(
      () =>
        new Promise((resolve, reject) => {
          if (!server) {
            startupPromise = null;
            resolve();
            return;
          }

          server.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            server = null;
            startupPromise = null;
            resolve();
          });
        })
    );

const gracefulShutdown = async (signal, exitCode = 0) => {
  try {
    shutdownRequested = true;
    clearDatabaseRetryTimer();
    await closeServer();
    await closeDatabaseConnection();
    process.exit(exitCode);
  } catch (error) {
    console.error(`Failed to shut down cleanly after ${signal}.`, error);
    process.exit(1);
  }
};

const bootstrap = async () => {
  await startServer();
  void connectToDatabase();
};

if (!isTestEnvironment) {
  attachDatabaseEventHandlers();
  process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => void gracefulShutdown("SIGINT"));

  bootstrap().catch((error) => {
    console.error("Application startup failed before the HTTP server became available.", error);
    void gracefulShutdown("APPLICATION_STARTUP_FAILURE", 1);
  });
}

module.exports = {
  app,
  get server() {
    return server;
  },
  getServer: () => server,
  broadcast,
  bootstrap,
  connectToDatabase,
  closeServer,
  gracefulShutdown,
  getDatabaseStatus,
  startServer,
};
