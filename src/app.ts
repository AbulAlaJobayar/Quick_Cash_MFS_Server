import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import notFound from './app/middleware/notFound';
import router from './app/route';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import compression from 'compression';

const app: Application = express();

// ====== Middlewares ======
// Security headers (Helmet)
app.use(helmet());

app.use(
  compression({
    level: 6, // Compression level (0 = no compression, 9 = max)
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false; // Skip compression
      return compression.filter(req, res); // Default filter
    },
  }),
);

// Rate limiting (for API routes only)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Limit each IP to 10000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Apply rate limiter only to API routes
app.use('/api', limiter);

// Body parser (JSON)
app.use(express.json());

// Cookie parser (for JWT/auth tokens)
app.use(cookieParser());

// CORS configuration (strict for security)
app.use(
  cors({
    origin: ['http://localhost:3000','https://quickcash-client.vercel.app'], 
    credentials: true, // Enable cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allowed methods
  }),
);

// ====== Routes ======
// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Quick Cash Server is Running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1', router);

// ====== Error Handling ======
// Global error handler
app.use(globalErrorHandler);

// 404 Not Found handler (must be last)
app.use(notFound);

export default app;
