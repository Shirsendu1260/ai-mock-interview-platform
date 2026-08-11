import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import interviewRouter from './routes/interview.routes.js';
import paymentRouter from './routes/payment.routes.js';
import jobRouter from './routes/job.routes.js';
import { DATA_LIMIT } from './constants.js';
import type { Request, Response, NextFunction } from 'express';
import { ApiError } from './utils/ApiError.js';
import { generalLimiter } from './middlewares/rateLimiter.middleware.js';
import PinoHttp from 'pino-http';
import { logger } from './config/logger.js';





const app = express();

// Adds common security related http headers to protect the API from vulnerabilities like XSS, clickjacking, MIME-type sniffing, etc.
app.use(helmet());

// Remove the X-Powered-By header (i.e. x-powered-by: Express)
app.disable('x-powered-by');

// Tells Express to trust the X-Forwarded-For headers sent by Render.
// This ensures express-rate-limit grabs the client's actual IP, not Render's proxy IP.
if(process.env.NODE_ENV === 'production') app.set('trust proxy', 1);





/****************************** MIDDLEWARES SETUP ******************************/

// Allow requests from frontend (CORS setup)
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	// Must be a specific origin (cannot be '*') when credentials are enabled

	credentials: true
	// Allows browsers to send cookies, authorization headers
}));

// Request ID middleware
// Assigns a unique ID (UUID) to every incoming request
// This ID is attached to every log entry for that request via pino-http
// In production, multiple users hit the server simultaneously
// Without a request ID, log entries from different requests get mixed together
// and we can't trace which log lines belong to which user's failing request
// The X-Request-Id header is also returned in the response
// so that the frontend can reference it when reporting bugs
app.use((req: Request, res: Response, next: NextFunction) => {
    // Use existing header if a gateway/proxy already set it, else generate a new one
    const requestId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
});

// HTTP request logger using pino-http
// Logs every incoming request and its response automatically
// Each log line includes: method, url, statusCode, responseTime, requestId
app.use(PinoHttp.pinoHttp({
	// Use our existing Pino logger config
    logger,

    // Attach the request ID from our middleware above so every log line has it
    genReqId: (req) => req.headers['x-request-id'] as string,

    // Don't log health check requests, they would spam the logs
    autoLogging: {
        ignore: (req) => req.url === '/health'
    },

    // Customize what gets logged for each request/response
    customLogLevel: (_, res) => {
        if(res.statusCode >= 500) return 'error';
        if(res.statusCode >= 400) return 'warn';
        return 'info';
    }
}));

// Webhook must come before express.json() as it is extracting raw Buffer data
app.use(
    '/api/v1/payments/webhook',
    express.raw({ type: 'application/json' })
);

// Parse incoming JSON request bodies (without this req.body would be undefined)
app.use(express.json({
	limit: DATA_LIMIT // Prevent very large payloads
}));

// Parse URL-encoded request bodies
app.use(express.urlencoded({
	extended: true,  // Allow nested objects (without this "user[name]=Shiv" would not parse correctly)
	limit: DATA_LIMIT
}));

// Serve static files directly from "public" folder
app.use(express.static('public'));

// Middleware that can access cookies from user's browser and set cookies in it
// Reads cookies from incoming HTTP requests (without this "req.cookies" would be undefined)
app.use(cookieParser());

// With rate limiter middleware, restricting client how many max. requests he/she can make to
// our APIs within a time window
app.use('/api/v1', generalLimiter);





/****************************** ROUTES SETUP ******************************/

///// Routes declaration /////

app.use('/api/v1/user', userRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/interviews', interviewRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/jobs', jobRouter);





// Health check endpoint
// To confirm the server is alive and the database is reachable
// This must be defined before the 404 handler so it doesn't get ignored
app.get('/health', async (_: Request, res: Response) => {
    try {
        // Only checks if the server process is alive and responding
        // DB connectivity is verified naturally on every real API request
        // Neon's serverless WebSocket closes idle connections, making
        // periodic DB pings unreliable and noisy in logs
        return res.status(200).json({
            status: true,
            message: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
    catch(error) {
        logger.error({ err: error }, 'Health check: database unreachable');
        return res.status(503).json({
            status: false,
            message: 'Database unreachable'
        });
    }
});

// 404 response for unknown routes
app.use((_: Request, res: Response) => {
	return res.status(404).json({
		statusCode: 404,
		success: false,
		message: 'Route not found.'
	});
});

// Global error handler (with all 4 parameters for Express to treat it as error handler middleware)
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
	if(err instanceof ApiError) {
        // 4xx errors are expected (bad input, auth failures), log as warn, not error
        // 5xx errors are unexpected server problems, log as error
        if(err.statusCode >= 500) {
            logger.error({
                err,
                statusCode: err.statusCode,
                requestId: req.headers['x-request-id'],
                url: req.url,
                method: req.method
            }, `Server error: ${err.message}`);
        }
        else {
            logger.warn({
                statusCode: err.statusCode,
                requestId: req.headers['x-request-id'],
                url: req.url
            }, `Client error: ${err.message}`);
        }

		return res.status(err.statusCode).json({
			statusCode: err.statusCode,
			success: false,
			message: err.message,
			errors: err.errors
		});
	}

	// Unexpected errors (not ApiError), these are bugs or crashes
    logger.error({
        err,
        requestId: req.headers['x-request-id'],
        url: req.url,
        method: req.method
    }, 'Unhandled error in request');

	return res.status(500).json({
		statusCode: 500,
		success: false,
		message: 'Internal Server Error.'
        // Never expose the raw error message for unexpected errors
	});
});






export { app };
