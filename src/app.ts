import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import notFound from './app/middleware/notFound';
import router from './app/route';
import globalErrorHandler from './app/middleware/globalErrorhandler';

const app: Application = express();
// middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// routes
app.use('/api/v1', router);
app.get('/', (req: Request, res: Response) => {
  res.send('Quick Cash is Up');
});
app.use(globalErrorHandler);
//Not found Route
app.use(notFound);
export default app;
