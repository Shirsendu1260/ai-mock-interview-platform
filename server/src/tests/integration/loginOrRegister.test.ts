import { describe, test, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';


// MOCKS //
// These mocks are hoisted by Vitest
// That means Vitest makes them available before the modules below are imported
// This is important because app.ts imports routes
// and those routes import the controller and its dependencies
// Mock database:
// The OAuth controller uses the database to
// 1. Find an existing user
// 2. Start a transaction when registering a new user
// We do not want this test to connect to the real Neon database
vi.mock('../../config/db.js', () => ({
    db: {
        select: vi.fn(),
        transaction: vi.fn(),
        update: vi.fn()
    }
}));


// Mock Firebase Admin
// The OAuth controller calls - admin.auth().verifyIdToken()
// We do not want the test to contact Firebase server
// Each test can decide whether Firebase should succeed or fail
vi.mock('../../config/firebaseAdmin.config.js', () => ({
    admin: {
        auth: vi.fn().mockReturnValue({
            verifyIdToken: vi.fn()
        })
    }
}));


// Mock environment validation
// app.ts calls validateEnv() when the application starts
// The test environment does not need the real environment validation
vi.mock('../../config/validateEnv.js', () => ({
    validateEnv: vi.fn()
}));


// Mock JWT token generation
// The OAuth controller calls generateAccessAndRefreshTokens()
// That utility has its own responsibilities
// Those responsibilities are tested separately in tokens.test.ts
// Here we only need predictable fake tokens
vi.mock('../../utils/tokens.js', () => ({
    generateAccessAndRefreshTokens: vi.fn().mockResolvedValue({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token'
    })
}));


// Mock Razorpay
// app.ts imports payment routes
// Payment routes eventually import the Razorpay configuration
// We are not testing Razorpay here
// So we replace it with harmless mock functions
vi.mock('../../config/razorpay.config.js', () => ({
    razorpay: {
        orders: { create: vi.fn(), fetch: vi.fn() },
        payments: { fetch: vi.fn() }
    }
}));


// Mock Gemini
// app.ts can load routes that eventually use the AI service
// The real Gemini client may require an API key during application startup
// We are not testing Gemini here, so we replace it with harmless mocks
vi.mock('../../services/ai/aiEngine.js', () => ({
    ai: vi.fn(),
    model: {
        generateContent: vi.fn()
    }
}));


// SHARED TEST DATA //

// This represents the decoded Firebase token
// It is what Firebase would return after successfully verifying a valid Firebase ID token
const mockDecodedFirebaseToken = {
    uid: 'firebase-uid-123',
    email: 'test@gmail.com',
    name: 'Test User',
    picture: 'https://photo.url/pic.jpg',
    firebase: {
        sign_in_provider: 'google.com'
    }
};

// This represents an existing user already stored in the database
// HerefirebaseUid and refreshToken are not included
// The real controller only selects safe fields when returning the user
const mockExistingUser = {
    id: 'user-uuid-123',
    fullName: 'Test User',
    email: 'test@gmail.com',
    avatarUrl: 'https://photo.url/pic.jpg',
    credit: 100,
    plan: 'free',
    authProvider: 'Google',
    createdAt: new Date(),
    updatedAt: new Date()
};

// This represents the user returned after a new user is registered
const mockNewUser = {
    id: 'new-user-uuid-456',
    fullName: 'Test User',
    email: 'test@gmail.com',
    avatarUrl: 'https://photo.url/pic.jpg',
    credit: 150,
    plan: 'free',
    authProvider: 'Google',
    createdAt: new Date(),
    updatedAt: new Date()
};


// APP SETUP //
// We keep app as unknown until beforeAll
// We intentionally do not use here - import { app } from '../../app.js'
// app.ts imports many routes and those routes' controllers import dependencies that we are mocking above
// We therefore import app dynamically inside beforeAll after Vitest has registered all of our mocks
let app: unknown;

// beforeAll runs once before all tests in this file
// We use it for setup that only needs to happen once
// In this test file we use it for - Setting test environment variables, and Dynamically importing the Express app
beforeAll(async () => {
    process.env.ACCESS_TOKEN_SECRET_KEY = 'test-access-secret-32chars-longxx';
    process.env.REFRESH_TOKEN_SECRET_KEY = 'test-refresh-secret-32chars-longx';
    process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY = '12h';
    process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY = '7d';
    process.env.NODE_ENV = 'test';
    process.env.CORS_ORIGIN = 'http://localhost:3000';

    // Import app only after all mocks have been registered
    // This is why we use dynamic import here instead of a static import
    // app.ts and its routes will now receive our mocked dependencies
    const module = await import('../../app.js');
    app = module.app;
});

// afterEach runs after every test in this file
// We use it to clean the state of our mocks, so one test does not affect another test
afterEach(() => {
    // Clear mock call history
    // For example - db.select()
    // may have been called three times in one test
    // After this call the next test starts with zero recorded calls
    vi.clearAllMocks();
});

// afterAll runs once after all tests in this file have finished
// We use it to remove the environment variables that were created specifically for these tests
afterAll(() => {
    delete process.env.ACCESS_TOKEN_SECRET_KEY;
    delete process.env.REFRESH_TOKEN_SECRET_KEY;
    delete process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY;
    delete process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY;
    delete process.env.NODE_ENV;
    delete process.env.CORS_ORIGIN;
});


// TESTS //

describe('POST /api/v1/user/sign-in/oauth', () => {
    const ENDPOINT = '/api/v1/user/sign-in/oauth';


    // AUTHORIZATION HEADER //

    test('should return 401 when Authorization header is missing', async () => {
        // We intentionally do not send an Authorization header
        // The controller should reject the request immediately before calling Firebase
        const response = await request(app).post(ENDPOINT);

        // The controller throws ApiError with status 401
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test('should return 401 when Authorization header does not start with Bearer', async () => {
        // The controller only accepts - Authorization: Bearer <token>
        const response = await request(app)
                                .post(ENDPOINT)
                                .set('Authorization', 'Basic some-token');

        // The controller should reject the request before Firebase is called
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test('should return 401 when Firebase token is invalid or expired', async () => {
        // Get the mocked Firebase Admin module
        const { admin } = await import('../../config/firebaseAdmin.config.js');

        // Tell the Firebase mock to reject the token
        // This simulates situations such as invalid token, expired token, tampered token
        // vi.mocked() makes admin.auth().verifyIdToken() a vitest mock function with our own implementation
        vi.mocked(admin.auth().verifyIdToken).mockRejectedValueOnce(new Error('Firebase: token expired'));

        // Send a request with a Bearer token
        const response = await request(app)
                                .post(ENDPOINT)
                                .set('Authorization', 'Bearer invalid-firebase-token');

        // The controller catches the Firebase error and converts it into a 401 ApiError
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);

        // Firebase rejected the token
        // so the controller should stop before querying the database
        const { db } = await import('../../config/db.js');
        expect(vi.mocked(db.select)).not.toHaveBeenCalled();
    });


    // EXISTING USER LOGIN //

    test('should return 200 and set cookies when existing user logs in', async () => {
        // Get the mocked Firebase Admin module
        const { admin } = await import('../../config/firebaseAdmin.config.js');

        // Firebase successfully verifies the token
        // The controller can now continue to the database
        vi.mocked(admin.auth().verifyIdToken).mockResolvedValueOnce(mockDecodedFirebaseToken as never);

        // mockResolvedValue -> returns same value in every tests
        // vi.fn().mockResolvedValue(data)
        // mockResolvedValueOnce -> only return the 'data' to the next call, after that it resets
        // vi.fn().mockResolvedValueOnce(data)

        // Get the mocked database
        const { db } = await import('../../config/db.js');

        // The controller performs a Drizzle query similar to
        // db.select(...).from(users).where(...).limit(1)
        // We only need to reproduce the method chain that the controller actually uses
        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    // Returning an existing user means the controller follows the login path
                    // The registration transaction should not run
                    limit: vi.fn().mockResolvedValue([mockExistingUser])
                })
            })
        } as never);
        // `as never` bypasses TypeScript's strict DB query type checking for this mock
        // We only care that the mocked query behaves correctly for this test

        // Send the request
        // This is similar to what the frontend sends
        const response = await request(app)
                                .post(ENDPOINT)
                                .set('Authorization', 'Bearer valid-firebase-token');

        // The login should succeed
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Verify the response message from the controller
        expect(response.body.message).toBe('User authenticated successfully.');

        // Verify that safe user information is returned
        expect(response.body.data.id).toBe(mockExistingUser.id);
        expect(response.body.data.email).toBe(mockExistingUser.email);
        expect(response.body.data.fullName).toBe(mockExistingUser.fullName);

        // The controller sends accessToken and refreshToken through HTTP-only cookies
        // They should not need to be returned as normal response data
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        // Supertest normally returns cookies as an array
        // Joining them makes checking the cookie names easier
        const cookieString = Array.isArray(cookies) ? cookies.join('; ') : cookies;

        expect(cookieString).toMatch(/accessToken/);
        expect(cookieString).toMatch(/refreshToken/);

        // Because this is an existing user
        // the registration transaction should never run
        expect(vi.mocked(db.transaction)).not.toHaveBeenCalled();
    });


    // NEW USER REGISTRATION //

    test('should return 200 and create new user when user does not exist', async () => {
        // Get the mocked Firebase Admin module
        const { admin } = await import('../../config/firebaseAdmin.config.js');

        // Tell Firebase to return a valid user
        vi.mocked(admin.auth().verifyIdToken).mockResolvedValueOnce(mockDecodedFirebaseToken as never);

        // Get the mocked database
        const { db } = await import('../../config/db.js');

        // The controller first checks if the user already exists
        // An empty array means: "No user was found"
        // Therefore, the controller will enter the registration code
        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([])
                })
            })
        } as never);

        // The controller now starts a database transaction
        // The real controller does this:
        // db.transaction(async (tx) => {
        //     ...
        // });
        //`tx` is the transaction object
        // We do not want to use the real database in this test
        // So we replace db.transaction() with our own fake version
        vi.mocked(db.transaction).mockImplementationOnce(async (callback: unknown) => {
            // This is the fake `tx.select()` chain
            // The controller uses it to check signupRewards
            // We return [] because this user has not received the signup reward before
            const txSelect = vi.fn().mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([])
                    })
                })
            });

            // The controller performs two insert operations
            // 1. Insert into signupRewards
            // 2. Insert the new user into users
            // So we create one mock function for tx.insert()
            const txInsert = vi.fn();

            // First insert
            // tx.insert(signupRewards).values(...)
            // This operation does not return the new row
            txInsert.mockReturnValueOnce({
                values: vi.fn().mockResolvedValue(undefined)
            });

            // Second insert
            // tx.insert(users)
            //     .values(...)
            //     .returning(...)
            // This operation returns the newly created user
            txInsert.mockReturnValueOnce({
                values: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([mockNewUser])
                })
            });

            // This is our fake transaction object
            // In TypeScript, an object can contain functions as properties
            // The real Drizzle transaction object has many methods
            // But our controller only uses select() and insert()
            // So we only create the methods that this test needs
            const tx = {
                select: txSelect,
                insert: txInsert
            };

            // `callback` is the function passed by the real controller
            // The controller has:
            // db.transaction(async (tx) => {
            //     ...
            // });
            // So `callback` represents this:
            // async (tx) => {
            //     ...
            // }
            // We now run that function and give it our fake `tx`
            // In simple terms:
            // "Controller, here is your fake transaction object now run your transaction code with it"
            return callback(tx as never);
        });

        // Send the actual HTTP request
        const response = await request(app)
                                .post(ENDPOINT)
                                .set('Authorization', 'Bearer valid-firebase-token');

        // Registration should succeed
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // Check the newly created user's information
        expect(response.body.data.id).toBe(mockNewUser.id);
        expect(response.body.data.email).toBe(mockNewUser.email);
        expect(response.body.data.fullName).toBe(mockNewUser.fullName);

        // The controller should have started one transaction
        expect(vi.mocked(db.transaction)).toHaveBeenCalledTimes(1);

        // The controller sends accessToken and refreshToken through HTTP-only cookies
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        // Supertest normally gives us an array of cookies
        // join() converts: ['accessToken=...', 'refreshToken=...']
        // into: 'accessToken=...; refreshToken=...'
        const cookieString = Array.isArray(cookies) ? cookies.join('; ') : cookies;

        // Check that both cookies were sent
        expect(cookieString).toMatch(/accessToken/);
        expect(cookieString).toMatch(/refreshToken/);
    });


    // RESPONSE SECURITY //

    test('should never expose refreshToken or firebaseUid in response body', async () => {
        // Get the mocked Firebase Admin module
        const { admin } = await import('../../config/firebaseAdmin.config.js');

        // Tell Firebase to return a valid user
        vi.mocked(admin.auth().verifyIdToken).mockResolvedValueOnce(mockDecodedFirebaseToken as never);

        // Get the mocked database
        const { db } = await import('../../config/db.js');

        // Return an existing user
        // mockExistingUser does not contain refreshToken & firebaseUid
        // This matches the fields selected by the real controller
        vi.mocked(db.select).mockReturnValueOnce({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([mockExistingUser])
                })
            })
        } as never);

        // Send the request
        const response = await request(app)
                                    .post(ENDPOINT)
                                    .set('Authorization', 'Bearer valid-firebase-token');

        // The request should succeed
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);

        // These are sensitive authentication fields that should never be exposed in the response body
        expect(response.body.data.refreshToken).toBeUndefined();
        expect(response.body.data.firebaseUid).toBeUndefined();

        // The controller sends accessToken and refreshToken through HTTP-only cookies
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const cookieString = Array.isArray(cookies) ? cookies.join('; ') : cookies;
        expect(cookieString).toMatch(/accessToken/);
        expect(cookieString).toMatch(/refreshToken/);
    });
});
