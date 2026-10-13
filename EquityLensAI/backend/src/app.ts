import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { getEnv } from './config/index.js';
import { docsRouter, openApiSpec } from './docs/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { requestId } from './middleware/requestId.js';
import { requestLogger } from './middleware/requestLogger.js';
import { sanitizeRequest } from './middleware/sanitizeRequest.js';
import { v1Router } from './routes/index.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { sendSuccess } from './utils/response.js';

export function createApp() {
  const env = getEnv();
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
          'img-src': ["'self'", 'data:', 'https://cdn.jsdelivr.net', 'https://scalar.com'],
          'connect-src': ["'self'", '*'],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
      exposedHeaders: ['X-Request-ID'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  app.use(hpp());
  app.use(requestId);
  app.use(sanitizeRequest);
  app.use(requestLogger);

  app.get(['/', '/api'], (_req, res) => {
    sendSuccess(res, {
      service: 'equitylensai-api',
      status: 'ok',
      version: 'v1',
      docs: '/docs',
      openapi: '/openapi.json',
      health: '/api/v1/health',
    });
  });

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiSpec);
  });

  app.use('/docs', docsRouter);
  app.use('/reference', docsRouter);

  app.use('/api/v1', v1Router);

  app.use(asyncHandler(notFoundHandler));
  app.use(errorHandler);

  return app;
}
