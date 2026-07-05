export const APP_NAME = "CodeInterviewerAI"; // Just a name of my choice

export const SOCIAL_LINKS = {
	github: 'https://github.com/Shirsendu1260',
	linkedin: 'https://linkedin.com/in/shirsendu-mali'
} as const;

export const DEVELOPER = {
	name: 'Shirsendu Mali'
} as const;

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
export const PAYMENT_STATUS = ['created', 'paid', 'failed'] as const;
export const CREDIT_TRANSACTION_TYPE = ['interview', 'purchase', 'job_search'] as const;
export const PAYMENTS_CREDITS_PAGE_LIMIT = 6;
