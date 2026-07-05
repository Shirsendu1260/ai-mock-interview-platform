export const DATA_LIMIT = "24kb";
// export const UPLOAD_DIR = '/public/temp';
export const UPLOAD_DIR = '/tmp/uploads';
export const COOKIE_SEND_OPTIONS = {
    httpOnly: true, // Cookie not accessible via JavaScript in browser (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Sent cookie only over HTTPS on production server
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' // CSRF
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

export const PAGINATION_LIMIT = 4;
export const PAYMENTS_CREDITS_PAGE_LIMIT = 10;

export const USER_PLANS = ['free', 'starter', 'pro', 'ultimate'] as const;

export const USER_PLANS_CREDITS = {
    free: { credits: 150, price: 0 }, // 0 Rs.
    starter: { credits: 800, price: 8900 }, // 89 Rs.
    pro: { credits: 2000, price: 21900 }, // 219 rs.
    ultimate: { credits: 6000, price: 54900 } // 549 Rs.

    // We set 8900, not 89
    // Because Razorpay expects paise, not rupees
};

export const PAID_PLANS = USER_PLANS.filter((plan) => plan !== 'free'); // Exclude 'free'

export const PAYMENT_STATUS = ["pending", "paid", "failed"] as const;
export const CREDIT_TRANSACTION_TYPES = ["purchase", "interview", "job_search"] as const;
