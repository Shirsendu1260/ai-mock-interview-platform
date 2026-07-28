import { logger } from './logger.js';

// All required env vars are checked once at startup, before the server
// opens its port and accepts any traffic
// If anything is missing, the server exits immediately with a clear error
// not silently mid-traffic
// This is called 'fail fast' and it's a core production principle

const REQUIRED_ENV_VARS = [
    'PORT',
    'NEONDB_URI',
    'CORS_ORIGIN',
    'NODE_ENV',
    'ACCESS_TOKEN_SECRET_KEY',
    'ACCESS_TOKEN_SECRET_KEY_EXPIRY',
    'REFRESH_TOKEN_SECRET_KEY',
    'REFRESH_TOKEN_SECRET_KEY_EXPIRY',
    'FIREBASE_SERVICE_ACCOUNT_JSON',
    'GEMINI_API_KEY',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'ADZUNA_APP_ID',
    'ADZUNA_APP_KEY'
] as const;

export const validateEnv = (): void => {
    const missing: string[] = [];

    for(const key of REQUIRED_ENV_VARS) {
        const value = process.env[key];
        if (!value || value.trim() === '') {
            missing.push(key);
        }
    }

    // If any env variable is missing
    if(missing.length > 0) {
        // Use logger.fatal for startup-time critical failures
        // logger.fatal writes the log then we exit, process never opens port
        logger.fatal(
            { missingVars: missing },
            `STARTUP FAILED: Missing required environment variables: ${missing.join(', ')}`
        );

        process.exit(1);
    }

    logger.info('Environment variables validated successfully.');
}
