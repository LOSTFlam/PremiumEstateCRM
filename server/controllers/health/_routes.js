const express = require("express");
const { getDatabaseStatus, isDatabaseReady } = require("../../utils/databaseState");

const router = express.Router();

const buildPayload = () => ({
  service: "premium-estate-server",
  environment: process.env.NODE_ENV || "development",
  timestamp: new Date().toISOString(),
  uptimeSeconds: Math.floor(process.uptime()),
  database: getDatabaseStatus(),
});

router.get("/live", (_req, res) => {
  res.status(200).json({
    status: "live",
    ...buildPayload(),
  });
});

router.get("/ready", (_req, res) => {
  const ready = isDatabaseReady();

  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "degraded",
    ...buildPayload(),
  });
});

router.get("/status", (_req, res) => {
  const ready = isDatabaseReady();

  res.status(ready ? 200 : 503).json({
    status: ready ? "healthy" : "degraded",
    ...buildPayload(),
  });
});

module.exports = router;
