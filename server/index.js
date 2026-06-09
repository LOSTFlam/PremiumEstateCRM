const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const db = require("./db/config");
const route = require("./controllers/route");
const errorHandler = require("./middlewares/errorHandler");
const { auditLog } = require("./middlewares/auditLog");
const { initWebSocket, broadcast } = require("./services/websocket");

require("dotenv").config();

const isTestEnvironment = process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);

const port = Number(process.env.PORT || 5001);
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((value) => String(value).trim());

//Setup Express App
const app = express();
app.disable("x-powered-by");

// Security middleware
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 5 : 1000,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
});

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Set up CORS with options
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const req = this;

    // Allow same-origin requests (handles crossorigin attribute on Vite assets)
    try {
      const host = req.get('host');
      if (host && origin.includes(host)) {
        return callback(null, true);
      }
    } catch {}

    // Extract hostname from origin to allow various IP addresses
    const isLocalhost = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
    const isLocalIP = origin && /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/.test(new URL(origin).hostname);
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    const isAllowed = isAllowedOrigin || isLocalhost || isLocalIP;

    if (isAllowed) {
      callback(null, true);
    } else {
      const error = new Error("Not allowed by CORS");
      error.statusCode = 403;
      callback(error);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Allow-Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'X-Total-Count']
}));

// Apply auth limiter to auth routes
app.use('/api/user', authLimiter);

// Apply audit logging
app.use('/api/user', auditLog);
app.use('/api/property', auditLog);

//API Routes
app.use('/api', route);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const distPath = path.join(__dirname, '../client/dist');
  app.use(express.static(distPath));

  // SPA fallback for client-side routing
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', async (req, res) => {
    res.send('Welcome to my world...')
  });
}

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);

// Create HTTP server
let server = null;

if (!isTestEnvironment) {
  server = app.listen(port, () => {
    const protocol = (process.env.HTTPS === true || process.env.NODE_ENV === 'production') ? 'https' : 'http';
    const { address, port } = server.address();
    const host = address === '::' ? '127.0.0.1' : address;
    // Console statement removed
  });

  // Initialize WebSocket server
  initWebSocket(server);
}

// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'PremiumEstateDB'

db(DATABASE_URL, DATABASE);

// Graceful shutdown
const gracefulShutdown = (signal) => {
  // Console statement removed
  if (!server) {
    process.exit(0);
  }
  server.close(() => {
    // Console statement removed
    process.exit(0);
  });
};

if (!isTestEnvironment) {
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

module.exports = { app, server, broadcast };
