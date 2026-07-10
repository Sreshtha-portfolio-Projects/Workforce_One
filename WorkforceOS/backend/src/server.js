import app from './app.js';
import logger from './utils/logger.js';
import { checkSupabaseConnection } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await checkSupabaseConnection();
    logger.info('✅ Supabase connection established');

    const server = app.listen(PORT, () => {
      logger.info(`🚀 WorkforceOS Backend Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    });

    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forcefully shutting down...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
  } catch (error) {
    if (error.code === 'SCHEMA_NOT_READY') {
      logger.error(error.message);
    } else if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      logger.error(
        'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env'
      );
    } else {
      logger.error('Failed to start server:', error);
    }
    process.exit(1);
  }
};

startServer();
