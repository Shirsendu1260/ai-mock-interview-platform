import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../../utils/ApiError.js';
import type { User } from '../../db/schema/users.js';

// Mock the database
// We mock the entire db module so no real DB calls happen
// generateAccessAndRefreshTokens() uses db.select() and db.update(),
// both of which are method chains, so we mock the full chain
vi.mock('../../config/db.js', () => ({
    // In our code, the DB query looks like this:
    // const [user] = await db.select({...}).from(users).where(eq(users.id, userId)).limit(1);
    // This is a method chain, every . returns a new object
    // To mock this, we need to mock the entire chain:
    // db.select() -> returns an object that has .from()
    // .from() -> returns an object that has .where()
    // .where() -> returns an object that has .limit()
    // .limit() -> returns a Promise that resolves to an array
    db: {
        select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    limit: vi.fn().mockResolvedValue([
                        // This is what the fake DB will return, a fake user
                        {
                            id: 'user-123',
                            fullName: 'Test User',
                            email: 'test@test.com',
                            avatarUrl: null,
                            credit: 100,
                            plan: 'free',
                            firebaseUid: 'firebase-uid-123',
                            refreshToken: null,
                            authProvider: 'google',
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                    ])
                })
            })
        }),

        // db.update(users).set({...}).where(...).returning({...})
        update: vi.fn().mockReturnValue({
            set: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([{ id: 'user-123' }])
                })
            })
        })
    }
}));

// Mock user object
// A fake user that matches the User type from schema
// We use 'as any' to avoid importing the full schema type
const mockUser = {
    id: 'user-123',
    fullName: 'Test User',
    email: 'test@test.com',
    avatarUrl: null,
    credit: 100,
    plan: 'free',
    firebaseUid: 'firebase-uid-123',
    refreshToken: null,
    authProvider: 'google',
    createdAt: new Date(),
    updatedAt: new Date(),
} as User;


describe('tokens', () => {
    // Set fake env vars before each test
    // Our token functions read from process.env
    // In tests there's no .env file as server node's process is not running, so we set them manually here
    beforeEach(() => {
        process.env.ACCESS_TOKEN_SECRET_KEY = 'test-access-secret-32chars-long!!';
        process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY = '12h';
        process.env.REFRESH_TOKEN_SECRET_KEY = 'test-refresh-secret-32chars-long!';
        process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY = '7d';
    });

    // Clean up env vars after each test
    // Without this, env vars from one test could leak into the next test,
    // causing unexpected results
    afterEach(() => {
        delete process.env.ACCESS_TOKEN_SECRET_KEY;
        delete process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY;
        delete process.env.REFRESH_TOKEN_SECRET_KEY;
        delete process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY;
        vi.clearAllMocks();
    });


    // generateAccessJWTToken

    describe('generateAccessJWTToken', () => {
        test('should return a valid JWT string', async () => {
            // Import here to get the function after mocks are set up
            // Static import (at the top of the file)
            // import { generateAccessJWTToken } from '../../utils/tokens.js';
            // Issue: Module loads before vi.mock() runs
            // process.env is not set yet -> environment variable missing when the function is imported
            // Dynamic import (inside the test)
            // env is set inside beforeEach, and only then the import happens
            const { generateAccessJWTToken } = await import('../../utils/tokens.js');

            // Act
            const token = await generateAccessJWTToken(mockUser);

            // Assert, a JWT always has 3 parts separated by dots
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        test('should embed correct payload in the token', async () => {
            const { generateAccessJWTToken } = await import('../../utils/tokens.js');

            // Act
            const token = await generateAccessJWTToken(mockUser);

            // Decode and verify the token using the same secret
            // If the secret is wrong, jwt.verify() throws, which would fail the test
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!) as JwtPayload;

            // Assert, payload must contain id, email, fullName
            expect(decoded.id).toBe(mockUser.id);
            expect(decoded.email).toBe(mockUser.email);
            expect(decoded.fullName).toBe(mockUser.fullName);
        });

        test('should not embed sensitive fields in the token', async () => {
            const { generateAccessJWTToken } = await import('../../utils/tokens.js');

            const token = await generateAccessJWTToken(mockUser);
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!) as JwtPayload;

            // refreshToken and firebaseUid must never be in the payload
            // If they were, anyone who decodes the token could read them
            expect(decoded.refreshToken).toBeUndefined();
            expect(decoded.firebaseUid).toBeUndefined();
        });

        test('should throw ApiError 500 when ACCESS_TOKEN_SECRET_KEY is missing', async () => {
            const { generateAccessJWTToken } = await import('../../utils/tokens.js');

            // Remove the env var to simulate missing ACCESS_TOKEN_SECRET_KEY
            delete process.env.ACCESS_TOKEN_SECRET_KEY;

            // Assert, must throw an ApiError with status 500
            await expect(generateAccessJWTToken(mockUser)).rejects.toThrow(ApiError);
            await expect(generateAccessJWTToken(mockUser)).rejects.toMatchObject({ statusCode: 500 });
        });

        test('should generate tokens with expiry (exp field should exist)', async () => {
            const { generateAccessJWTToken } = await import('../../utils/tokens.js');

            const token = await generateAccessJWTToken(mockUser);
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY!) as JwtPayload;

            // exp is the Unix timestamp when the token expires
            // It must exist and be in the future
            expect(decoded.exp).toBeDefined();
            expect(decoded.exp!).toBeGreaterThan(Math.floor(Date.now() / 1000)); // exp > current time
        });

    });


    // generateRefreshJWTToken

    describe('generateRefreshJWTToken', () => {
        test('should return a valid JWT string', async () => {
            const { generateRefreshJWTToken } = await import('../../utils/tokens.js');
            const token = await generateRefreshJWTToken(mockUser);
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        test('should only embed user id in payload (minimal payload)', async () => {
            const { generateRefreshJWTToken } = await import('../../utils/tokens.js');
            const token = await generateRefreshJWTToken(mockUser);
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY!) as JwtPayload;

            // Refresh token payload should be minimal, only id
            // Less data = smaller token = less exposure if stolen
            expect(decoded.id).toBe(mockUser.id);
            expect(decoded.email).toBeUndefined();
            expect(decoded.fullName).toBeUndefined();
        });

        test('should throw ApiError 500 when REFRESH_TOKEN_SECRET_KEY is missing', async () => {
            const { generateRefreshJWTToken } = await import('../../utils/tokens.js');
            delete process.env.REFRESH_TOKEN_SECRET_KEY;
            await expect(generateRefreshJWTToken(mockUser)).rejects.toThrow(ApiError);
            await expect(generateRefreshJWTToken(mockUser)).rejects.toMatchObject({ statusCode: 500 });
        });

        test('access and refresh tokens should be different strings', async () => {
            const { generateAccessJWTToken, generateRefreshJWTToken } = await import('../../utils/tokens.js');
            const accessToken = await generateAccessJWTToken(mockUser);
            const refreshToken = await generateRefreshJWTToken(mockUser);

            // They must be different, different secrets, different payloads
            expect(accessToken).not.toBe(refreshToken);
        });
    });


    // generateAccessAndRefreshTokens //

    describe('generateAccessAndRefreshTokens', () => {
        test('should return both accessToken and refreshToken', async () => {
            const { generateAccessAndRefreshTokens } = await import('../../utils/tokens.js');

            const result = await generateAccessAndRefreshTokens('user-123');

            // Both tokens must exist in the result
            expect(result).toHaveProperty('accessToken');
            expect(result).toHaveProperty('refreshToken');
            expect(typeof result.accessToken).toBe('string');
            expect(typeof result.refreshToken).toBe('string');
            expect(result.accessToken.split('.')).toHaveLength(3);
            expect(result.refreshToken.split('.')).toHaveLength(3);
        });

        test('should throw ApiError 404 when user is not found in DB', async () => {
            const { generateAccessAndRefreshTokens } = await import('../../utils/tokens.js');

            // Import the mocked db instance from our module
            const { db } = await import('../../config/db.js');

            // EXECUTE THE MOCK CHAIN UP TO THE LAST METHOD
            // Calling db.select().from().where() follows our existing vi.mock setup written at top of this file
            // It navigates down to the final method: .limit()
            // We pass empty objects `{}` as dummy arguments to keep TypeScript happy
            // We cast it to `ReturnType<typeof vi.fn>` so Vitest recognizes .limit as a mock function
            const limitMockFn = db.select({} as never)
                                    .from({} as never)
                                    .where({} as never)
                                    .limit as ReturnType<typeof vi.fn>;

            // OVERRIDE ONLY THE FINAL RETURN VALUE FOR THIS SPECIFIC TEST
            // .mockResolvedValueOnce([]) forces .limit() to resolve to an empty array [] once
            // An empty array simulates "user not found" in database
            // After this test finishes, .limit() automatically reverts back to returning the default user
            limitMockFn.mockResolvedValueOnce([]);

            // Run the function and assert that it rejects with a 404 ApiError
            await expect(generateAccessAndRefreshTokens('non-existent-user'))
                .rejects
                .toMatchObject({ statusCode: 404 });
        });
    });
});
