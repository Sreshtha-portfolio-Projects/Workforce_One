import morgan from 'morgan';
import logger from '../utils/logger.js';

morgan.token('user', (req) => {
  return req.user ? req.user.id : 'anonymous';
});

morgan.token('organization', (req) => {
  return req.user?.organizationId || 'none';
});

const stream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

export const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms - User: :user - Org: :organization',
  { stream }
);

export const logRequest = (req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id,
    organizationId: req.user?.organizationId
  });
  next();
};
