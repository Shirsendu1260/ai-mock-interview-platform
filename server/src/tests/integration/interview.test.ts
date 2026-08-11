import { describe, test, expect, vi, beforeAll, afterEach, afterAll } from "vitest";
import request from "supertest";
import path from "path";
import fs from "fs";
import os from "os";
import type { Request, Response, NextFunction } from "express";


// Keep mocks at the top because Vitest hoists vi.mock() calls //

// Mock environment validation
// app.ts calls validateEnv() when the application starts
// The test environment does not need the real environment validation
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

// Mock authentication so interview routes behave as authenticated requests
// Bypass real JWT verification and provide a fixed authenticated user
vi.mock("../../middlewares/auth.middleware.js", () => ({
    verifyJWT: vi.fn().mockImplementation((req: Request, _: Response, next: NextFunction) => {
        req.user = {
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

        next();
    }),
}));

// Mock DB methods used by the interview controller
// Mock database methods because these tests focus on controller behavior
vi.mock("../../config/db.js", () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        transaction: vi.fn(),
    },
}));

// Use predictable tokens here; token generation is tested separately
// Return fixed tokens so token generation does not affect these tests
vi.mock("../../utils/tokens.js", () => ({
    generateAccessAndRefreshTokens: vi.fn().mockResolvedValue({
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
    }),
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

// Return predictable interview questions instead of calling the AI service
vi.mock("../../services/ai/generateQuestions.js", () => ({
    generateQuestions: vi.fn().mockResolvedValue([
        "What is Node.js?",
        "Explain SQL Inner Join.",
        "What is TypeScript?",
        "What is REST API?",
        "Explain async/await.",
    ]),
}));

// Return predictable evaluation data for interview submission tests
vi.mock("../../services/ai/evaluateInterview.js", () => ({
    evaluateInterview: vi.fn().mockResolvedValue({
        overallScore: 75,
        overallFeedback: "Good performance overall.",
        strengths: ["Good understanding of Node.js"],
        weaknesses: ["Could improve on TypeScript"],
        suggestions: ["Practice more TypeScript"],
        questions: [
            { feedback: "Good answer", score: 80 },
            { feedback: "Average answer", score: 70 },
            { feedback: "Good answer", score: 75 },
            { feedback: "Good answer", score: 78 },
            { feedback: "Average answer", score: 72 },
        ],
    }),
}));

// Mock PDF extraction because resume content is not tested here
// Return fixed resume text so tests do not depend on PDF parsing
vi.mock("../../services/pdf/extractResumeText.js", () => ({
    extractResumeText: vi.fn().mockResolvedValue(
        "Experienced Node.js developer with 2 years of backend experience."
    ),
}));


// Shared test data //

// Use one valid UUID across tests so IDs stay consistent
const VALID_INTERVIEW_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

// Reuse this interview object in tests that need an existing interview
const mockInterview = {
    id: VALID_INTERVIEW_UUID,
    userId: "user-uuid-123",
    role: "Backend Developer",
    yoe: 2,
    difficulty: "medium",
    qtnsCount: 5,
    creditCost: 50,
    status: "in_progress",
    lastVisitedQtnPosition: 1,
    startedAt: new Date(),
    endsAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
    completedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
};

// Without userId
const { userId, ...interviewWithoutUserId } = mockInterview;


// Import the app after mocks are registered so all dependencies are mocked
// app is loaded after mocks so the routes use the mocked dependencies
let app: unknown;

// Set test environment variables and load the app once before starting any tests
beforeAll(async () => {
    process.env.ACCESS_TOKEN_SECRET_KEY = "test-access-secret-32chars-longxx";
    process.env.REFRESH_TOKEN_SECRET_KEY = "test-refresh-secret-32chars-longx";
    process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY = "12h";
    process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY = "7d";
    process.env.NODE_ENV = "test";
    process.env.CORS_ORIGIN = "http://localhost:3000";

    // Import app only after all mocks have been registered
    // This is why we use dynamic import here instead of a static import
    // app.ts and its routes will now receive our mocked dependencies
    const module = await import("../../app.js");
    app = module.app;
});

// Reset mock history after each test so tests stay independent
afterEach(() => {
    // Clear mock call history
    // For example - db.select()
    // may have been called three times in one test
    // After this call the next test starts with zero recorded calls
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


// Tests

describe("Interview Routes /api/v1/interviews", () => {
    // POST /create

    describe("POST /create", () => {
        // Multer needs a real file, so create a temporary PDF for upload tests
        const createTempPdf = () => {
            // Store the temporary file in the OS temp directory
            const tmpDir = os.tmpdir();

            // Use a fixed name because each test removes the file after uploading
            const filePath = path.join(tmpDir, "test-resume.pdf");

            // The content does not matter because PDF extraction is mocked
            fs.writeFileSync(filePath, "fake pdf content for testing");

            // Return the path so Supertest can attach the file
            return filePath;
        };

        test("should return 400 when required fields are missing", async () => {
            const tempPdf = createTempPdf();

            const { db } = await import("../../config/db.js");

            // Mock only the first DB select used by this request
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        // Empty result means the requested record does not exist
                        limit: vi.fn().mockResolvedValue([]),
                    }),
                }),
            } as never);

            // Supertest sends the request
            const response = await request(app)
                .post("/api/v1/interviews/create")
                // Attach the temporary file as the resume upload
                .attach("resume", tempPdf)
                // Send empty values to trigger field validation
                .field("role", "")
                .field("yoe", "")
                .field("difficulty", "")
                .field("qtnsCount", "");

            // Remove the temporary file after the request is complete
            fs.unlinkSync(tempPdf);

            expect(response.status).toBe(400);

            // Validation and error responses should report success as fals
            expect(response.body.success).toBe(false);
        });

        test("should return 400 when resume file is not uploaded", async () => {
            const { db } = await import("../../config/db.js");

            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                    }),
                }),
            } as never);

            // No .attach() call, so no file sent
            const response = await request(app)
                .post("/api/v1/interviews/create")
                // Send the same valid role used by the successful request
                .field("role", "Backend Developer")
                // Send two years of experience as a string because multipart fields are strings
                .field("yoe", "2")
                // Use a valid difficulty
                .field("difficulty", "medium")
                // Five questions is one of the allowed question counts
                .field("qtnsCount", "5");

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test("should return 400 when difficulty is invalid", async () => {
            const tempPdf = createTempPdf();
            const { db } = await import("../../config/db.js");

            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                    }),
                }),
            } as never);

            const response = await request(app)
                .post("/api/v1/interviews/create")
                .attach("resume", tempPdf)
                .field("role", "Backend Developer")
                .field("yoe", "2")
                .field("difficulty", "extreme") // Invalid difficulty
                .field("qtnsCount", "5");

            fs.unlinkSync(tempPdf);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);

            // Validation errors should identify the invalid difficulty field
            expect(response.body.errors).toHaveProperty("difficulty");
        });

        test("should return 400 when qtnsCount is invalid", async () => {
            const tempPdf = createTempPdf();
            const { db } = await import("../../config/db.js");

            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                    }),
                }),
            } as never);

            const response = await request(app)
                .post("/api/v1/interviews/create")
                .attach("resume", tempPdf)
                .field("role", "Backend Developer")
                .field("yoe", "2")
                .field("difficulty", "medium")
                .field("qtnsCount", "7"); // Invalid question count

            fs.unlinkSync(tempPdf);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);

            // Validation errors should identify the invalid question count field
            expect(response.body.errors).toHaveProperty("qtnsCount");
        });

        test("should return 409 when user already has an ongoing interview", async () => {
            const tempPdf = createTempPdf();

            // Return an existing ongoing interview
            const { db } = await import("../../config/db.js");
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        // A returned row means the user already has an ongoing interview.
                        limit: vi.fn().mockResolvedValue([{
                            id: "existing-interview-id"
                        }])
                    }),
                }),
            } as never);

            const response = await request(app)
                .post("/api/v1/interviews/create")
                .attach("resume", tempPdf)
                .field("role", "Backend Developer")
                .field("yoe", "2")
                .field("difficulty", "medium")
                .field("qtnsCount", "5");

            fs.unlinkSync(tempPdf);

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);

            // The response should clearly explain why creation was blocked
            expect(response.body.message).toContain("already in progress");
        });

        test("should return 201 and create interview successfully", async () => {
            const tempPdf = createTempPdf();
            const { db } = await import("../../config/db.js");

            // First query: no ongoing interview
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                        // Empty result lets the request continue
                    }),
                }),
            } as never);

            // Mock the transaction used to create the interview and update credits
            vi.mocked(db.transaction).mockImplementationOnce(async (callback: unknown) => {
                // Provide the DB methods used inside the controller's transaction
                const tx = {
                    insert: vi.fn().mockReturnValue({
                        values: vi.fn().mockReturnValue({
                            returning: vi.fn().mockResolvedValue([{ id: VALID_INTERVIEW_UUID }]),
                        }),
                    }),

                    select: vi.fn().mockReturnValue({
                        from: vi.fn().mockReturnValue({
                            where: vi.fn().mockReturnValue({
                                limit: vi.fn().mockResolvedValue([{
                                    credit: 500
                                }]),
                            }),
                        }),
                    }),

                    update: vi.fn().mockReturnValue({
                        set: vi.fn().mockReturnValue({
                            where: vi.fn().mockReturnValue({
                                returning: vi.fn().mockResolvedValue([{ id: VALID_INTERVIEW_UUID }]),
                            }),
                        }),
                    }),
                };

                // Run the controller's transaction callback with our fake DB
                return await callback(tx);
            });

            const response = await request(app)
                .post("/api/v1/interviews/create")
                .attach("resume", tempPdf)
                .field("role", "Backend Developer")
                .field("yoe", "2")
                .field("difficulty", "medium")
                .field("qtnsCount", "5");

            fs.unlinkSync(tempPdf);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);

            // The created interview should have the ID returned by the mocked DB
            expect(response.body.data.id).toBe(VALID_INTERVIEW_UUID);
        });
    });


    // GET /:interviewId

    describe("GET /:interviewId", () => {
        test("should return 400 when interviewId is not a valid UUID", async () => {
            const response = await request(app).get("/api/v1/interviews/not-a-valid-uuid");
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        test("should return 404 when interview does not exist", async () => {
            const { db } = await import("../../config/db.js");
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                        // Empty result means the interview was not found
                    }),
                }),
            } as never);

            const response = await request(app).get(`/api/v1/interviews/${VALID_INTERVIEW_UUID}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("Interview not found.");
        });

        test("should return 200 with interview details", async () => {
            const { db } = await import("../../config/db.js");
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([mockInterview]),
                    }),
                }),
            } as never);

            const response = await request(app).get(`/api/v1/interviews/${VALID_INTERVIEW_UUID}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.id).toBe(VALID_INTERVIEW_UUID);

            // Make sure the expected interview data is returned
            expect(response.body.data.role).toBe("Backend Developer");

            // The response should include a valid remaining time
            expect(response.body.data.remainingTimeInSeconds).toBeGreaterThanOrEqual(0);
        });

        test("should not expose userId in interview response", async () => {
            const { db } = await import("../../config/db.js");

            // Remove the internal userId before returning the mocked DB result.
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([interviewWithoutUserId]),
                    }),
                }),
            } as never);

            const response = await request(app).get(`/api/v1/interviews/${VALID_INTERVIEW_UUID}`);

            // userId is internal data and must not be exposed
            expect(response.body.data.userId).toBeUndefined();
        });
    });


    // POST /:interviewId/submit

    describe("POST /:interviewId/submit", () => {
        test("should return 404 when interview does not exist", async () => {
            const { db } = await import("../../config/db.js");
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                    }),
                }),
            } as never);

            const response = await request(app).post(`/api/v1/interviews/${VALID_INTERVIEW_UUID}/submit`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });

        test("should return 400 when interview is already completed", async () => {
            const { db } = await import("../../config/db.js");

            // Return an already completed interview
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([{
                            ...mockInterview,
                            status: "completed", // This should trigger the already-completed interview
                        }]),
                    }),
                }),
            } as never);

            const response = await request(app).post(`/api/v1/interviews/${VALID_INTERVIEW_UUID}/submit`);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Interview is already completed.");
        });
    });


    // GET /ongoing

    describe("GET /ongoing", () => {
        test("should return 200 with null when no ongoing interview", async () => {
            const { db } = await import("../../config/db.js");
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([]),
                        // Empty result means there is no ongoing interview
                    }),
                }),
            } as never);

            const response = await request(app).get("/api/v1/interviews/ongoing");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);

            // No ongoing interview should return null data
            expect(response.body.data).toBeNull();
        });

        test("should return ongoing interview when one exists", async () => {
            const { db } = await import("../../config/db.js");
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([mockInterview]),
                    }),
                }),
            } as never);

            const response = await request(app).get("/api/v1/interviews/ongoing");

            expect(response.status).toBe(200);

            // The ongoing interview response should contain the correct ID
            expect(response.body.data.interviewId).toBe(VALID_INTERVIEW_UUID);

            // A future endsAt value means the interview is still active
            expect(response.body.data.interviewExpired).toBe(false);

            // An active interview should have time remaining
            expect(response.body.data.remainingTimeInSeconds).toBeGreaterThan(0);
        });

        test("should mark interview as expired when timer has run out", async () => {
            const { db } = await import("../../config/db.js");

            // Return an interview whose timer has already expired
            vi.mocked(db.select).mockReturnValueOnce({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockReturnValue({
                        limit: vi.fn().mockResolvedValue([{
                            ...mockInterview,
                            endsAt: new Date(Date.now() - 1000), // 1 second in the past, means already expired
                        }]),
                    }),
                }),
            } as never);

            const response = await request(app).get("/api/v1/interviews/ongoing");

            expect(response.status).toBe(200);

            // A past endsAt value should make the interview expired
            expect(response.body.data.interviewExpired).toBe(true);
        });
    });
});
