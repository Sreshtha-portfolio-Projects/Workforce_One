import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { generalLimiter } from './middleware/rateLimit.middleware.js';

import authRoutes from './modules/auth/auth.routes.js';

dotenv.config();

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'WorkforceOS API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/auth`, authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
