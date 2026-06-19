export const DATA_LIMIT = "24kb";
export const UPLOAD_DIR = '/public/temp';
// export const UPLOAD_DIR = '/tmp/uploads';
export const COOKIE_SEND_OPTIONS = {
    httpOnly: true, // Cookie not accessible via JavaScript in browser (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Sent cookie only over HTTPS on production server
    sameSite: 'strict' // Cookie is never sent with cross-site requests (CSRF protection)
} as const;

export const NO_OF_QUESTIONS = [5, 10, 15, 20] as const;
export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export const INTERVIEW_STATUS = ['in_progress', 'paused', 'completed'] as const;

export const CREDIT_COST = {
    easy: 3,
    medium: 5,
    hard: 6
} as const;

export const TIME_PER_QUESTION = {
    easy: 3, // minutes
    medium: 4.5,
    hard: 6
} as const;
