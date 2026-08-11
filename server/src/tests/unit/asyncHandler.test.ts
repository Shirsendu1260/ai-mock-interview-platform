import { describe, test, expect, vi, type Mock } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../utils/asyncHandler.js';

describe('asyncHandler', () => {
    // We create fake req, res, next for every test
    // We don't need a real Express server, we just need objects
    // that look like req/res/next to asyncHandler
    const mockReq = {} as Request;
    const mockRes = {} as Response;


    // Test 1: Successful controller //

    test('should call the controller and resolve successfully', async () => {
        // Arrange
        // A fake controller that succeeds, returns a resolved promise
        // This simulates a normal controller that doesn't throw
        const successController = vi.fn().mockResolvedValue(undefined);
        const mockNext = vi.fn() as NextFunction;

        // Act
        // asyncHandler wraps our controller and returns a new middleware function
        // We immediately call that middleware with fake req, res, next
        const controllerMiddleware = asyncHandler(successController);
        await controllerMiddleware(mockReq, mockRes, mockNext);

        // Assert
        // Controller should have been called exactly once with req, res, next
        expect(successController).toHaveBeenCalledTimes(1);
        expect(successController).toHaveBeenCalledWith(mockReq, mockRes, mockNext);

        // next() should not have been called, no error occurred
        expect(mockNext).not.toHaveBeenCalled();
    });


    // Test 2: Controller that throws an error //

    test('should call next(error) when controller throws', async () => {
        // Arrange
        const testError = new Error('Something went wrong in controller');

        // A fake controller that throws, simulates a controller with a bug
        // mockRejectedValue means: when called, return a rejected Promise
        const failingController = vi.fn().mockRejectedValue(testError);
        const mockNext = vi.fn() as NextFunction;

        // Act
        const controllerMiddleware = asyncHandler(failingController);
        await controllerMiddleware(mockReq, mockRes, mockNext);

        // Assert
        // next() must have been called with the error
        // This is how Express routes errors to the global error handler
        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith(testError);
    });


    // Test 3: Controller that throws synchronously //

    test('should catch synchronous errors too', async () => {
        // Arrange
        const syncError = new Error('Sync error');

        // This controller throws synchronously (not async)
        const syncThrowingController = vi.fn().mockImplementation(() => {
            throw syncError;
        });

        // mockImplementation -> "when called, run this function"
        // Unlike mockResolvedValue/mockRejectedValue which deal with promises,
        // mockImplementation lets us define exact behaviour

        const mockNext = vi.fn() as NextFunction;

        // Act
        const controllerMiddleware = asyncHandler(syncThrowingController);
        await controllerMiddleware(mockReq, mockRes, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledWith(syncError);
    });


    // Test 4: Returns a function //

    test('should return a middleware function', () => {
        // Arrange
        const anyController = vi.fn();

        // Act
        const result = asyncHandler(anyController);

        // Assert
        // asyncHandler must return a function
        // Express needs this to be a function to use as middleware
        expect(typeof result).toBe('function');
    });


    // Test 5: ApiError passes through correctly //

    test('should pass ApiError instances to next() unchanged', async () => {
        // Arrange
        // Import ApiError dynamically to avoid circular dependency issues
        const { ApiError } = await import('../../utils/ApiError.js');
        const apiError = new ApiError(404, 'User not found');

        const failingController = vi.fn().mockRejectedValue(apiError);
        const mockNext = vi.fn() as NextFunction & Mock; // Mock gives vitest's mock props

        // Act
        const controllerMiddleware = asyncHandler(failingController);
        await controllerMiddleware(mockReq, mockRes, mockNext);

        // Assert
        // The exact same ApiError instance must reach next()
        // Global error handler we defined checks instanceof ApiError, so it must be unchanged
        expect(mockNext).toHaveBeenCalledWith(apiError);

        // mock.calls[0] could be undefined in TS's eyes
        // But we already verfied above that mockNext was called
        // so it's safe to use ! to tell TS that "this definitely exists"
        expect(mockNext.mock.calls[0]![0]).toBeInstanceOf(ApiError);

        // const mockFn = vi.fn();
        // mockFn('hello', 'world');
        // mockFn('foo');
        // mock.calls stores the arguments from every call:
        // [
        //   ['hello', 'world'], // Arguments of the first call
        //   ['foo']             // Arguments of the second call
        // ]
        // Access the first argument of the first call:
        // mockFn.mock.calls[0][0] // 'hello'
        // Access the first argument of the second call:
        // mockFn.mock.calls[1][0] // 'foo'
        // So here, mockNext.mock.calls[0][0] is 'apiError'
    });
});
