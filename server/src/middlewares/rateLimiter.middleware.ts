import rateLimit from 'express-rate-limit';

// General rate limiter that applies to all routes
// Prevents server abuse
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 30, // Limit each IP to this amount of requests per 'window' (here, per 15 minutes)
	standardHeaders: 'draft-8', // Sends standard RateLimit headers in response
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: {
		statusCode: 429,
		success: false,
		message: 'Too many requests, please try again after 15 minutes.'
	}
});

// Auth rate limiter that applies to auth routes
export const authLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 60 minutes
	limit: 6,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		statusCode: 429,
		success: false,
		message: 'Too many login/register requests, please try again after 1 hour.'
	}
});

// For refresh token route
export const refreshLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 15,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		statusCode: 429,
		success: false,
		message: 'Too many refresh token requests, please try again after 15 minutes.'
	}
});