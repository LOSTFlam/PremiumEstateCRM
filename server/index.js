const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const db = require("./db/config");
const route = require("./controllers/route");
const errorHandler = require("./middelwares/errorHandler");

require("dotenv").config();

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
app.use(helmet()); // Security headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow cross-origin for images

// Compression middleware
app.use(compression());

// Rate limiting (disabled for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 10000, // Higher limit for development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to API routes only
app.use('/api', limiter);

// Stricter rate limit for auth endpoints (disabled for development)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 1000, // Higher limit for development
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
});

// Middleware
app.use(cookieParser()); // Parse cookies
app.use(bodyParser.json({ limit: '10mb' })); // Limit body size
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Set up CORS with options
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed =
      allowedOrigins.includes(origin) ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1");

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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Apply auth limiter to auth routes
app.use('/api/user', authLimiter);

//API Routes
app.use('/api', route);

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});

app.use(errorHandler);


app.get('/', async (req, res) => {
    res.send('Welcome to my world...')
});

// Get port from environment and store in Express.

const server = app.listen(port, () => {
    const protocol = (process.env.HTTPS === true || process.env.NODE_ENV === 'production') ? 'https' : 'http';
    const { address, port } = server.address();
    const host = address === '::' ? '127.0.0.1' : address;
    console.log(`Server listening at ${protocol}://${host}:${port}/`);
});


// Connect to MongoDB
const DATABASE_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
const DATABASE = process.env.DB || 'PremiumEstateDB'

db(DATABASE_URL, DATABASE);
