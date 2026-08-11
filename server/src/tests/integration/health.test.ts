import { describe, test, expect, vi } from 'vitest';
import request from 'supertest';


// Mock validateEnv //
// index.ts calls validateEnv() which checks process.env
// In tests, we don't have all env vars, so we mock it to do nothing
// vi.mock() replaces the real module with our fake implementation
// This prevents the test from depending on the real environment variables
vi.mock('../../config/validateEnv.js', () => ({
    validateEnv: vi.fn()
}));

// Mock Firebase Admin //
// app.ts imports routes, which import controllers, which import firebaseAdmin.config.ts
// Firebase tries to initialize with FIREBASE_SERVICE_ACCOUNT_JSON from process.env
// In tests this env var doesn't exist, so Firebase crashes on import
// We mock the entire module to prevent initialization
// We are not testing Firebase here
// We only want to test the Express application's /health and 404 behavior
// Therefore, Firebase's real initialization would only be unnecessary test noise
vi.mock('../../config/firebaseAdmin.config.js', () => ({
    admin: {
        auth: vi.fn().mockReturnValue({
            verifyIdToken: vi.fn()
        })
    }
}));

// Mock Razorpay Config directly (Prevents new Razorpay() from throwing error)
// app.ts imports routes, and some of those routes eventually import the Razorpay configuration
// We don't want the test environment to initialize
// a real Razorpay client or require real Razorpay credentials
// The mocked methods are enough to satisfy the imports
// We are not actually testing Razorpay in this test file
vi.mock('../../config/razorpay.config.js', () => ({
    razorpay: {
        orders: { create: vi.fn(), fetch: vi.fn() },
        payments: { fetch: vi.fn() }
    }
}));

// Mock Gemini Config
// The AI service may create/configure an AI client when the module is imported
// That initialization can require an API key
// We are not testing Gemini or the AI service here, so we replace it with
// simple Vitest mock functions to prevent real API initialization
vi.mock('../../services/ai/aiEngine.js', () => ({
    ai: vi.fn(),
    model: {
        generateContent: vi.fn()
    }
}));


// Static import works reliably once mocks are set up
// The modules above are mocked before importing app.ts
// When app.ts imports its dependencies, Vitest gives it the mocked versions (we defined above)
// instead of the real implementations
// This allows us to import the real Express app while keeping external
// services such as Firebase, Razorpay and Gemini isolated from the tests
import { app } from '../../app.js';


// Tests //

describe('GET /health', () => {
    // The current /health endpoint only checks whether the Express server
    // is alive and able to respond to an HTTP request
    // /health does not use the database, we do not mock db.execute() in this test file
    test('should return 200 with message "ok"', async () => {
        // Act, make a real HTTP GET request to /health
        // `request(app)` comes from Supertest
        // It allows us to send an HTTP request directly to our Express app
        // without starting the server with app.listen()
        const response = await request(app).get('/health');

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('ok');
    });

    test('should return timestamp and uptime', async () => {
        const response = await request(app).get('/health');

        // timestamp must be a valid ISO date string
        // `toBeDefined()` checks that the property exists and is not undefined
        expect(response.body.timestamp).toBeDefined();

        // `new Date(...).toISOString()` converts the timestamp into the standard ISO 8601 format
        // If the original value is already a valid ISO timestamp generated
        // by our application, converting it back should produce the same string
        expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);

        // uptime must be a positive number (seconds since process started)
        // `process.uptime()` returns the number of seconds the Node.js process has been running
        // We first verify that the API returned a number rather than a string, null, object, etc.
        expect(typeof response.body.uptime).toBe('number');

        // The process has been running long enough to have a positive uptime
        expect(response.body.uptime).toBeGreaterThan(0);
    });

    test('should return JSON content type', async () => {
        const response = await request(app).get('/health');

        // Response must be JSON, not HTML or plain text
        // Express automatically sets the Content-Type header when using res.json()
        // The actual header normally looks something like:
        // application/json; charset=utf-8
        // Therefore, we use `toMatch()` with a regular expression instead of checking for an exact string
        expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    test('should return 404 for unknown routes', async () => {
        // We intentionally request a route that does not exist
        // This verifies that our 404 middleware at the bottom of app.ts
        // catches requests that were not handled by any registered route
        const response = await request(app).get('/this-route-does-not-exist');

        // The HTTP status must be 404 because the requested route does not exist
        expect(response.status).toBe(404);

        // Our 404 middleware explicitly returns `success: false`
        expect(response.body.success).toBe(false);

        // Verify the statusCode returned inside the JSON response as well
        // This is different from `response.status`:
        // response.status      -> HTTP status code
        // response.body.statusCode -> value inside our JSON response
        expect(response.body.statusCode).toBe(404);

        // Verify the actual error message returned by our 404 middleware.
        expect(response.body.message).toBe('Route not found.');
    });
});
