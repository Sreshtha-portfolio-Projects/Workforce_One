import { Router } from 'express';
import { apiReference } from '@scalar/express-api-reference';
import { openApiSpec } from './openapi.js';

export const docsRouter = Router();

// Expose the raw OpenAPI JSON specification
docsRouter.get('/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

// Interactive Scalar API Reference UI
docsRouter.use(
  '/',
  apiReference({
    spec: {
      content: openApiSpec,
    },
    theme: 'saturn',
    layout: 'modern',
    darkMode: true,
    pageTitle: 'EquityLensAI API Documentation',
  }),
);
