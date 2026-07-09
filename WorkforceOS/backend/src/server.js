import app from './app.js';
import logger from './utils/logger.js';
import pool from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info('✅ Database connection established');

    const server = app.listen(PORT, () => {
      logger.info(`🚀 WorkforceOS Backend Server running on port ${PORT}`);
      logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    });

    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await pool.end();
          logger.info('Database pool closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
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
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
