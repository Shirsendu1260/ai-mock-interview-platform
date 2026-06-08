export const DATA_LIMIT = "24kb";
export const SALT_ROUNDS = 10;
export const UPLOAD_DIR = '/public/temp';
// export const UPLOAD_DIR = '/tmp/uploads';
export const COOKIE_SEND_OPTIONS = {
    httpOnly: true, // Cookie not accessible via JavaScript in browser (XSS protection)
    secure: process.env.NODE_ENV === 'production', // Sent cookie only over HTTPS on production server
    sameSite: 'strict' // Cookie is never sent with cross-site requests (CSRF protection)
} as const;