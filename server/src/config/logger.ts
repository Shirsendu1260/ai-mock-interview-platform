import pino from 'pino';

const isDevelopment = process.env.NODE_ENV === 'local';

// Create centralized logger instance that will be used throughout the project
export const logger = pino({
    level: isDevelopment ? 'debug' : 'info',
    // level: 'info' -> logs info, warn, error, fatal
    // level: 'debug' -> logs debug, info, warn, error, fatal

    // In production, logs stay JSON (exactly what cloud providers expect), in local server it is colorized
    transport: isDevelopment ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard', // Instead of 1785123456789, we get '2026-07-28 18:12:00'
            ignore: 'pid,hostname'
        }
    } : undefined
});
