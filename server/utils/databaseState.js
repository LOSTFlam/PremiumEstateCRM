const mongoose = require("mongoose");

const DEFAULT_MONGO_PORT = 27017;
const READY_STATE_LABELS = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const state = {
  configuredEndpoint: {
    url: null,
    host: null,
    port: DEFAULT_MONGO_PORT,
    database: null,
  },
  hasSuccessfulInitialization: false,
  applicationReady: false,
  lastConnectionAttemptAt: null,
  lastConnectedAt: null,
  lastReadyAt: null,
  lastDisconnectedAt: null,
  lastError: null,
  retryAttempt: 0,
  retryDelayMs: null,
  nextRetryAt: null,
};

const serializeError = (error) => {
  if (!error) {
    return null;
  }

  return {
    name: error.name || "Error",
    message: error.message || String(error),
    ...(error.code ? { code: error.code } : {}),
  };
};

const parseMongoEndpoint = (connectionString, fallbackDatabaseName) => {
  try {
    const url = new URL(connectionString);
    const databaseFromUrl = String(url.pathname || "").replace(/^\/+/, "");

    return {
      url: connectionString,
      host: url.hostname || null,
      port: url.port ? Number.parseInt(url.port, 10) : DEFAULT_MONGO_PORT,
      database: fallbackDatabaseName || databaseFromUrl || null,
    };
  } catch {
    return {
      url: connectionString,
      host: null,
      port: DEFAULT_MONGO_PORT,
      database: fallbackDatabaseName || null,
    };
  }
};

const getReadyStateLabel = (readyState = mongoose.connection.readyState) =>
  READY_STATE_LABELS[readyState] || "unknown";

const setDatabaseConfig = (connectionString, databaseName) => {
  state.configuredEndpoint = parseMongoEndpoint(connectionString, databaseName);
};

const clearRetryState = () => {
  state.retryAttempt = 0;
  state.retryDelayMs = null;
  state.nextRetryAt = null;
};

const markConnectionAttempt = () => {
  state.applicationReady = false;
  state.lastConnectionAttemptAt = new Date().toISOString();
};

const markTransportConnected = () => {
  const now = new Date().toISOString();
  state.lastConnectedAt = now;

  if (state.hasSuccessfulInitialization) {
    state.applicationReady = true;
    state.lastReadyAt = now;
    state.lastError = null;
    clearRetryState();
  }
};

const markReady = () => {
  const now = new Date().toISOString();
  state.hasSuccessfulInitialization = true;
  state.applicationReady = true;
  state.lastConnectedAt = state.lastConnectedAt || now;
  state.lastReadyAt = now;
  state.lastError = null;
  clearRetryState();
};

const markUnavailable = (error) => {
  state.applicationReady = false;
  state.lastDisconnectedAt = new Date().toISOString();

  if (error) {
    state.lastError = serializeError(error);
  }
};

const markRetryScheduled = (attempt, delayMs, error) => {
  state.applicationReady = false;
  state.retryAttempt = attempt;
  state.retryDelayMs = delayMs;
  state.nextRetryAt = new Date(Date.now() + delayMs).toISOString();

  if (error) {
    state.lastError = serializeError(error);
  }
};

const isDatabaseReady = () => state.applicationReady && mongoose.connection.readyState === 1;

const getResolvedEndpoint = () => {
  if (mongoose.connection.readyState === 1) {
    return {
      url: state.configuredEndpoint.url,
      host: mongoose.connection.host || state.configuredEndpoint.host,
      port: mongoose.connection.port || state.configuredEndpoint.port,
      database: mongoose.connection.name || state.configuredEndpoint.database,
    };
  }

  return state.configuredEndpoint;
};

const getDatabaseStatus = () => ({
  ready: isDatabaseReady(),
  connected: mongoose.connection.readyState === 1,
  initialized: state.hasSuccessfulInitialization,
  readyState: mongoose.connection.readyState,
  state: getReadyStateLabel(),
  endpoint: getResolvedEndpoint(),
  lastConnectionAttemptAt: state.lastConnectionAttemptAt,
  lastConnectedAt: state.lastConnectedAt,
  lastReadyAt: state.lastReadyAt,
  lastDisconnectedAt: state.lastDisconnectedAt,
  lastError: state.lastError,
  retryAttempt: state.retryAttempt,
  retryDelayMs: state.retryDelayMs,
  nextRetryAt: state.nextRetryAt,
});

module.exports = {
  clearRetryState,
  getDatabaseStatus,
  getReadyStateLabel,
  isDatabaseReady,
  markConnectionAttempt,
  markReady,
  markRetryScheduled,
  markTransportConnected,
  markUnavailable,
  serializeError,
  setDatabaseConfig,
};
