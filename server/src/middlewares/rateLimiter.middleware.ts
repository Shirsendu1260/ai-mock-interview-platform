import rateLimit from 'express-rate-limit';

// General rate limiter that applies to all routes
// Prevents server abuse
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 50, // Limit each IP to 50 requests per 'window' (here, per 15 minutes)
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
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 10,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		statusCode: 429,
		success: false,
		message: 'Too many requests, please try again after 15 minutes.'
	}
});

// Strict signup rate limiter to prevent bot account creation spams
export const signUpLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 1 day
	max: 2,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		statusCode: 429,
		success: false,
		message: 'Too many accounts created from this IP today.'
	}
});