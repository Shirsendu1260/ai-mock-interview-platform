import PinoHttp from 'pino-http';
import { logger } from '../config/logger.js';

// Create http logger middleware with our existing Pino logger config
export const httpLogger = PinoHttp.pinoHttp({ logger });
