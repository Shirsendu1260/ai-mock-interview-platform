import { describe, test, expect, vi, beforeAll, afterEach, afterAll } from 'vitest';
import request from 'supertest';
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import type { Express } from "express";

// // `describe.skip()` gives Vitest a valid test setup while making sure
// // these tests do not run until we actually implement them
// describe.skip('Refresh Token integration tests', () => {
//
// });


// Mocks //

// Mock environment validation
vi.mock('../../config/validateEnv.js', () => ({
    validateEnv: vi.fn()
}));

// Keep Firebase mocked so integration tests do not make real OAuth calls
vi.mock("../../config/firebaseAdmin.config.js", () => ({
    admin: {
        auth: vi.fn().mockReturnValue({
            verifyIdToken: vi.fn(),
        }),
    },
}));

// Mock DB, refreshAccessToken does:
// 1. db.select() -> find user by decoded token id
// 2. generateAccessAndRefreshTokens() -> internally does select + update
vi.mock('../../config/db.js', () => ({
    db: {
        select: vi.fn(),
        update: vi.fn()
    }
}));

// Mock token generation, we already tested this separately
vi.mock('../../utils/tokens.js', () => ({
    generateAccessAndRefreshTokens: vi.fn().mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
    })
}));

// Mock Razorpay because payment logic is not part of this test file
vi.mock("../../config/razorpay.config.js", () => ({
    razorpay: {
        orders: { create: vi.fn(), fetch: vi.fn() },
        payments: { fetch: vi.fn() },
    },
}));

// Mock the Gemini client so app does not need a real API key or AI services when starting up
vi.mock("../../services/ai/aiEngine.js", () => ({
    ai: vi.fn(),
    model: {
        generateContent: vi.fn(),
    },
}));


// Helpers //

const REFRESH_SECRET = 'test-refresh-secret-32chars-longx';
const ACCESS_SECRET  = 'test-access-secret-32chars-longxx';

// Generate a real signed JWT, controller calls jwt.verify() which needs a real token
const makeRefreshToken = (payload: object, expiresIn = '7d') => {
    return jwt.sign(
        payload as JwtPayload,
        REFRESH_SECRET,
        { expiresIn } as SignOptions
    );
}

// Fake user stored in DB, must have refreshToken field matching what we send
const makeMockUser = (refreshToken: string) => ({
    id: 'user-uuid-123',
    fullName: 'Test User',
    email: 'test@gmail.com',
    avatarUrl: 'https://photo.url/pic.jpg',
    credit: 100,
    plan: 'free',
    authProvider: 'Google',
    refreshToken, // must match the cookie value for refresh token rotation check
    createdAt: new Date(),
    updatedAt: new Date()
});


// App setup //

// app is loaded after mocks so the routes use the mocked dependencies
let app: Express;

// Set test environment variables and load the app once before starting any tests
beforeAll(async () => {
    process.env.ACCESS_TOKEN_SECRET_KEY = "test-access-secret-32chars-longxx";
    process.env.REFRESH_TOKEN_SECRET_KEY = "test-refresh-secret-32chars-longx";
    process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY = "12h";
    process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY = "7d";
    process.env.NODE_ENV = "test";
    process.env.CORS_ORIGIN = "http://localhost:3000";

    // Import app only after all mocks have been registered
    const module = await import("../../app.js");
    app = module.app;
});

// Reset mock history after each test so tests stay independent
afterEach(() => {
    vi.clearAllMocks();
});

// Remove test-only environment variables after all tests are done
afterAll(() => {
    delete process.env.ACCESS_TOKEN_SECRET_KEY;
    delete process.env.REFRESH_TOKEN_SECRET_KEY;
    delete process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY;
    delete process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY;
    delete process.env.NODE_ENV;
    delete process.env.CORS_ORIGIN;
});


// Tests //

describe('POST /api/v1/user/refresh-token', () => {
    const ENDPOINT = '/api/v1/user/refresh-token';

    // Missing cookie //

    test('should return 401 when refresh token cookie is missing', async () => {
        // No cookie sent at all
        const response = await request(app).post(ENDPOINT);
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    // Invalid/tampered token //

    test('should return 401 when refresh token is not a valid JWT', async () => {
        const response = await request(app)
                                .post(ENDPOINT)
                                .set('Cookie', 'refreshToken=this-is-not-a-jwt');

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test('should return 401 when refresh token is signed with wrong secret', async () => {
        // Sign with a different secret, jwt.verify() will reject it
        const wrongToken = jwt.sign({ id: 'user-uuid-123' }, 'completely-wrong-secret');

        const response = await request(app).post(ENDPOINT).set('Cookie', `refreshToken=${wrongToken}`);
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test('should return 401 when refresh token is expired', async () => {
        // Create a token that expired 1 second ago, so no waiting is needed
        const expiredToken = jwt.sign(
            { id: 'user-uuid-123', exp: Math.floor(Date.now() / 1000) - 1 },
            REFRESH_SECRET
        );

        const response = await request(app)
                                .post(ENDPOINT)
                                .set('Cookie', `refreshToken=${expiredToken}`);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    // User not found //

    test('should return 401 when user does not exist in DB', async () => {
        const validToken = makeRefreshToken({ id: 'user-uuid-123' });

        const { db } = await import('../../config/db.js');

        // DB returns empty, user deleted after token was issued
        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([])
                })
            })
        } as never);

        const response = await request(app).post(ENDPOINT).set('Cookie', `refreshToken=${validToken}`);

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    // Token rotation mismatch //

    test('should return 401 when cookie\'s refresh token does not match DB stored token', async () => {
        // This is the security core of refresh token rotation
        // If someone uses an old refresh token (already rotated)
        // the cookie value won't match the DB value, hence reject
        const sentToken = makeRefreshToken({ id: 'user-uuid-123' });

        // Use a different token value for the DB
        const differentTokenInDb = makeRefreshToken({ id: 'another-user-uuid' });

        // So this becomes the DB stored user
        const DBStoredUser = makeMockUser(differentTokenInDb);

        const { db } = await import('../../config/db.js');
        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([
                        DBStoredUser // DB has different token
                    ])
                })
            })
        } as never);

        const response = await request(app).post(ENDPOINT).set('Cookie', `refreshToken=${sentToken}`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Refresh token is expired or used.');
    });


    // Token is valid //

    test('should return 200 on valid refresh token', async () => {
        const validToken = makeRefreshToken({ id: 'user-uuid-123' });

        const { db } = await import('../../config/db.js');
        const DBStoredUser = makeMockUser(validToken);

        // DB returns user whose stored refreshToken matches what was sent in cookie
        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([DBStoredUser])
                })
            })
        } as never);

        const response = await request(app).post(ENDPOINT).set('Cookie', `refreshToken=${validToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Access token is refreshed successfully.');
    });

    test('should set new accessToken and refreshToken cookies in response', async () => {
        const validToken = makeRefreshToken({ id: 'user-uuid-123' });

        const { db } = await import('../../config/db.js');
        const DBStoredUser = makeMockUser(validToken);

        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([DBStoredUser])
                })
            })
        } as never);

        const response = await request(app).post(ENDPOINT).set('Cookie', `refreshToken=${validToken}`);

        // Both new tokens must be in Set-Cookie header
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const cookieString = Array.isArray(cookies) ? cookies.join('; ') : cookies;
        expect(cookieString).toMatch(/accessToken/);
        expect(cookieString).toMatch(/refreshToken/);
    });

    test('should return both newly issued tokens in response body', async () => {
        const validToken = makeRefreshToken({ id: 'user-uuid-123' });

        const { db } = await import('../../config/db.js');
        const DBStoredUser = makeMockUser(validToken);

        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([DBStoredUser])
                })
            })
        } as never);

        const response = await request(app).post(ENDPOINT).set('Cookie', `refreshToken=${validToken}`);

        expect(response.body.data.accessToken).toBe('mock-access-token');
        expect(response.body.data.refreshToken).toBe('mock-refresh-token');
    });

});
