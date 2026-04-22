const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

let wss = null;
const clients = new Map();

const initWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const params = new URLSearchParams(req.url.split("?")[1]);
    const token = params.get("token");

    if (!token) {
      ws.close(1008, "Authentication required");
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.userId = decoded.userId;
      ws.userRole = decoded.role;
      clients.set(ws.userId, ws);

      ws.on("message", (message) => {
        try {
          const data = JSON.parse(message);
          handleMessage(ws, data);
        } catch (error) {
          ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
        }
      });

      ws.on("close", () => {
        clients.delete(ws.userId);
      });

      ws.on("error", (error) => {
        // Console statement removed
        clients.delete(ws.userId);
      });

      ws.send(JSON.stringify({
        type: "connected",
        userId: ws.userId,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      ws.close(1008, "Invalid token");
    }
  });

  // Console statement removed
  return wss;
};

const handleMessage = (ws, data) => {
  switch (data.type) {
    case "ping":
      ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
      break;
    case "subscribe":
      if (data.channels && Array.isArray(data.channels)) {
        ws.channels = data.channels;
        ws.send(JSON.stringify({ type: "subscribed", channels: data.channels }));
      }
      break;
    default:
      ws.send(JSON.stringify({ type: "unknown", message: "Unknown message type" }));
  }
};

const broadcast = (message, excludeUserId = null) => {
  const data = JSON.stringify(message);
  clients.forEach((ws, userId) => {
    if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};

const sendToUser = (userId, message) => {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
    return true;
  }
  return false;
};

const sendToRole = (role, message) => {
  const data = JSON.stringify(message);
  clients.forEach((ws, userId) => {
    if (ws.userRole === role && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
};

const getOnlineUsers = () => Array.from(clients.keys());

const getOnlineCount = () => clients.size;

module.exports = {
  initWebSocket,
  broadcast,
  sendToUser,
  sendToRole,
  getOnlineUsers,
  getOnlineCount,
};
