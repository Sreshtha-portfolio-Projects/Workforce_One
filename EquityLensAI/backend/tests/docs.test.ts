import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { loadEnv } from '../src/config/index.js';

describe('Scalar API Documentation & OpenAPI Spec', () => {
  beforeAll(() => {
    loadEnv({
      NODE_ENV: 'test',
      PORT: '4000',
      FRONTEND_URL: 'http://localhost:3000',
      LOG_LEVEL: 'info',
    });
  });

  it('serves OpenAPI 3.1.0 specification at /openapi.json', async () => {
    const app = createApp();
    const response = await request(app).get('/openapi.json');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toMatchObject({
      openapi: '3.1.0',
      info: {
        title: 'EquityLensAI API',
        version: '1.0.0',
      },
    });
    expect(response.body.paths).toHaveProperty('/api/v1/health');
    expect(response.body.paths).toHaveProperty('/api/v1/stocks/search');
    expect(response.body.paths).toHaveProperty('/api/v1/stocks/{ticker}');
    expect(response.body.paths).toHaveProperty('/api/v1/ai/research');
  });

  it('serves Scalar interactive documentation UI at /docs', async () => {
    const app = createApp();
    const response = await request(app).get('/docs');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('scalar');
  });

  it('serves Scalar interactive documentation UI at /reference alias', async () => {
    const app = createApp();
    const response = await request(app).get('/reference');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
    expect(response.text).toContain('scalar');
  });

  it('includes docs and openapi endpoints in root discovery responses', async () => {
    const app = createApp();
    const rootRes = await request(app).get('/');
    expect(rootRes.status).toBe(200);
    expect(rootRes.body.data).toMatchObject({
      docs: '/docs',
      openapi: '/openapi.json',
      health: '/api/v1/health',
    });

    const v1Res = await request(app).get('/api/v1');
    expect(v1Res.status).toBe(200);
    expect(v1Res.body.data.endpoints).toMatchObject({
      docs: '/docs',
      openapi: '/openapi.json',
      health: '/api/v1/health',
    });
  });
});
