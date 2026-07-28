import rateLimit from 'express-rate-limit';

// General rate limiter that applies to all routes
// Prevents server abuse
export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 60, // Limit each IP to this amount of requests per 'window' (here, per 15 minutes)
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

// For job search route
export const jobSearchLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 15,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		statusCode: 429,
		success: false,
		message: 'Too many job search requests, please try again after 1 hour.'
	}
});

// For job bookmarking
export const jobBookmarkLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 20,
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	message: {
		statusCode: 429,
		success: false,
		message: 'Too many job bookmark requests, please try again after 15 minutes.'
	}
});


// For interview report PDF download
// Puppeteer/Chromium is CPU and memory intensive, one PDF can spike RAM significantly
// On Render's free tier (512MB RAM), concurrent PDF generation would cause crashes
// This limits each IP to 6 PDF downloads per 25 minutes, which is generous for real use
// but tight enough to block abuse
export const reportDownloadLimiter = rateLimit({
    windowMs: 25 * 60 * 1000,
    limit: 6,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        statusCode: 429,
        success: false,
        message: 'Too many report download requests, please try again after 25 minutes.'
    }
});

// For AI-heavy endpoints: interview creation and submission
// These endpoints call the Gemini API and do multiple DB writes
export const aiOperationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 32, // 32 interview create/submit operations per hour per IP
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        statusCode: 429,
        success: false,
        message: 'Too many AI operation requests, please try again after 1 hour.'
    }
});
