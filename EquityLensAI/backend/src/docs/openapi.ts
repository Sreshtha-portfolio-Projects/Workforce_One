import { ASSET_TYPES, MARKETS } from '@equitylensai/shared';

export const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'EquityLensAI API',
    version: '1.0.0',
    description:
      'AI-powered market intelligence, equity research, and real-time market data platform API documentation.',
    contact: {
      name: 'EquityLensAI Engineering',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Current environment server',
    },
    {
      url: 'http://localhost:4000',
      description: 'Local development server',
    },
  ],
  tags: [
    {
      name: 'System',
      description: 'Health checks and service metadata',
    },
    {
      name: 'Stocks',
      description: 'Asset discovery, search, and real-time quotes',
    },
    {
      name: 'AI Research',
      description: 'Generative AI equity synthesis, analysis, and reports',
    },
    {
      name: 'Market',
      description: 'Macro indices, sector performance, and exchange status',
    },
    {
      name: 'Watchlists',
      description: 'Custom user watchlists and asset collections',
    },
  ],
  paths: {
    '/': {
      get: {
        tags: ['System'],
        summary: 'Root service discovery',
        description: 'Returns top-level API service status and health link.',
        responses: {
          '200': {
            description: 'Service status',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiSuccessEnvelope',
                },
                example: {
                  success: true,
                  data: {
                    service: 'equitylensai-api',
                    status: 'ok',
                    version: 'v1',
                    health: '/api/v1/health',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1': {
      get: {
        tags: ['System'],
        summary: 'API v1 index',
        description: 'Returns available v1 API endpoints and service version.',
        responses: {
          '200': {
            description: 'V1 endpoint directory',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiSuccessEnvelope',
                },
                example: {
                  success: true,
                  data: {
                    service: 'equitylensai-api',
                    status: 'ok',
                    version: 'v1',
                    endpoints: {
                      health: '/api/v1/health',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description:
          'Returns current API health and uptime timestamp. Does not depend on external data providers or databases.',
        parameters: [
          {
            $ref: '#/components/parameters/RequestIdHeader',
          },
        ],
        responses: {
          '200': {
            description: 'API is healthy',
            headers: {
              'X-Request-ID': {
                schema: {
                  type: 'string',
                },
                description: 'Unique request correlation ID',
              },
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      $ref: '#/components/schemas/HealthData',
                    },
                  },
                },
                example: {
                  success: true,
                  data: {
                    status: 'ok',
                    service: 'equitylensai-api',
                    timestamp: '2026-10-13T12:00:00.000Z',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/stocks/search': {
      get: {
        tags: ['Stocks'],
        summary: 'Search stocks and financial instruments',
        description: 'Search for equities, ETFs, indices, and crypto assets by symbol or name.',
        parameters: [
          {
            $ref: '#/components/parameters/RequestIdHeader',
          },
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search keyword, ticker symbol, or company name',
            schema: {
              type: 'string',
              example: 'RELIANCE',
            },
          },
          {
            name: 'market',
            in: 'query',
            required: false,
            description: 'Filter by exchange / market',
            schema: {
              type: 'string',
              enum: MARKETS,
              example: 'nse',
            },
          },
          {
            name: 'assetType',
            in: 'query',
            required: false,
            description: 'Filter by asset class',
            schema: {
              type: 'string',
              enum: ASSET_TYPES,
              example: 'equity',
            },
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Maximum number of items to return (1-50)',
            schema: {
              type: 'integer',
              default: 10,
              minimum: 1,
              maximum: 50,
            },
          },
        ],
        responses: {
          '200': {
            description: 'Matching search results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/StockSearchItem',
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error (missing or invalid query)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorEnvelope' },
              },
            },
          },
        },
      },
    },
    '/api/v1/stocks/{ticker}': {
      get: {
        tags: ['Stocks'],
        summary: 'Get stock details and quote',
        description: 'Returns real-time quote, valuation, and fundamentals for a specific ticker.',
        parameters: [
          {
            $ref: '#/components/parameters/RequestIdHeader',
          },
          {
            name: 'ticker',
            in: 'path',
            required: true,
            description: 'Ticker symbol (e.g. RELIANCE, TCS, AAPL)',
            schema: {
              type: 'string',
              example: 'RELIANCE',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Stock details and quote',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/StockQuote',
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Ticker not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorEnvelope' },
              },
            },
          },
        },
      },
    },
    '/api/v1/ai/research': {
      post: {
        tags: ['AI Research'],
        summary: 'Generate AI equity research report',
        description:
          'Triggers Gemini AI research synthesis evaluating financial statements, transcripts, and market sentiment.',
        parameters: [
          {
            $ref: '#/components/parameters/RequestIdHeader',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['ticker'],
                properties: {
                  ticker: {
                    type: 'string',
                    example: 'INFY',
                    description: 'Target ticker symbol',
                  },
                  mode: {
                    type: 'string',
                    enum: ['quick', 'comprehensive', 'earnings'],
                    default: 'quick',
                    description: 'Depth of analysis',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Synthesized equity research report',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/ResearchReport',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid request body',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApiErrorEnvelope' },
              },
            },
          },
        },
      },
    },
    '/api/v1/market': {
      get: {
        tags: ['Market'],
        summary: 'Market overview',
        description: 'Returns major market indices (NIFTY 50, S&P 500), sector performance, and market breadth.',
        parameters: [
          {
            $ref: '#/components/parameters/RequestIdHeader',
          },
          {
            name: 'market',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
              enum: MARKETS,
              default: 'nse',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Market overview payload',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        market: { type: 'string', example: 'nse' },
                        status: { type: 'string', example: 'open' },
                        indices: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/StockQuote',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/watchlists': {
      get: {
        tags: ['Watchlists'],
        summary: 'List user watchlists',
        description: 'Retrieves all watchlists created by the authenticated user.',
        parameters: [
          {
            $ref: '#/components/parameters/RequestIdHeader',
          },
        ],
        responses: {
          '200': {
            description: 'List of watchlists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Watchlist',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Watchlists'],
        summary: 'Create a watchlist',
        description: 'Creates a new empty or populated watchlist.',
        parameters: [
          {
            $ref: '#/components/parameters/RequestIdHeader',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'Blue Chips',
                  },
                  symbols: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['RELIANCE', 'TCS', 'HDFCBANK'],
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Watchlist created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['success', 'data'],
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      $ref: '#/components/schemas/Watchlist',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/openapi.json': {
      get: {
        tags: ['System'],
        summary: 'OpenAPI specification',
        description: 'Returns the raw OpenAPI 3.1.0 specification in JSON format.',
        responses: {
          '200': {
            description: 'OpenAPI 3.1 schema document',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token to authenticate requests.',
      },
    },
    parameters: {
      RequestIdHeader: {
        name: 'X-Request-ID',
        in: 'header',
        required: false,
        description: 'Client-supplied correlation ID. Echoed back in the response headers and structured logs.',
        schema: {
          type: 'string',
          format: 'uuid',
          example: '87d80459-8380-4d68-a06b-26773e38f6ad',
        },
      },
    },
    schemas: {
      ApiSuccessEnvelope: {
        type: 'object',
        required: ['success', 'data'],
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
            description: 'Payload data',
          },
        },
      },
      ApiErrorEnvelope: {
        type: 'object',
        required: ['success', 'error'],
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR',
              },
              message: {
                type: 'string',
                example: 'Invalid request parameters',
              },
              details: {
                type: 'object',
                description: 'Optional granular error breakdown (e.g. Zod validation issues)',
              },
            },
          },
        },
      },
      HealthData: {
        type: 'object',
        required: ['status', 'service', 'timestamp'],
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
          service: {
            type: 'string',
            example: 'equitylensai-api',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-13T12:00:00.000Z',
          },
        },
      },
      StockSearchItem: {
        type: 'object',
        required: ['ticker', 'name', 'market', 'assetType'],
        properties: {
          ticker: {
            type: 'string',
            example: 'RELIANCE',
          },
          name: {
            type: 'string',
            example: 'Reliance Industries Limited',
          },
          market: {
            type: 'string',
            enum: MARKETS,
            example: 'nse',
          },
          assetType: {
            type: 'string',
            enum: ASSET_TYPES,
            example: 'equity',
          },
        },
      },
      StockQuote: {
        type: 'object',
        required: ['ticker', 'name', 'price', 'change', 'changePercent', 'currency', 'market', 'assetType'],
        properties: {
          ticker: {
            type: 'string',
            example: 'RELIANCE',
          },
          name: {
            type: 'string',
            example: 'Reliance Industries Limited',
          },
          price: {
            type: 'number',
            example: 2980.5,
          },
          change: {
            type: 'number',
            example: 24.3,
          },
          changePercent: {
            type: 'number',
            example: 0.82,
          },
          currency: {
            type: 'string',
            example: 'INR',
          },
          market: {
            type: 'string',
            enum: MARKETS,
            example: 'nse',
          },
          assetType: {
            type: 'string',
            enum: ASSET_TYPES,
            example: 'equity',
          },
        },
      },
      ResearchReport: {
        type: 'object',
        required: ['id', 'ticker', 'summary', 'sentiment', 'bullCase', 'bearCase', 'createdAt'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '4fa1b582-72c1-4822-8367-a5ec08659d4c',
          },
          ticker: {
            type: 'string',
            example: 'INFY',
          },
          summary: {
            type: 'string',
            example:
              'Infosys demonstrated strong large-deal pipeline momentum and operating margin expansion in Q3.',
          },
          sentiment: {
            type: 'string',
            enum: ['bullish', 'neutral', 'bearish'],
            example: 'bullish',
          },
          bullCase: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'Generative AI service pipeline reached $3B TCV',
              'BFSI discretionary spending rebound in North America',
            ],
          },
          bearCase: {
            type: 'array',
            items: { type: 'string' },
            example: ['Attrition ticked up slightly in core engineering', 'European macro headwinds remain sticky'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-13T12:00:00.000Z',
          },
        },
      },
      Watchlist: {
        type: 'object',
        required: ['id', 'name', 'symbols', 'createdAt'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: 'a12bc34d-56ef-7890-abcd-ef1234567890',
          },
          name: {
            type: 'string',
            example: 'High Beta Tech',
          },
          symbols: {
            type: 'array',
            items: { type: 'string' },
            example: ['TCS', 'INFY', 'WIPRO', 'HCLTECH'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-13T12:00:00.000Z',
          },
        },
      },
    },
  },
};
