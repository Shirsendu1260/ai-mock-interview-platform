import { describe, test, expect } from 'vitest';
import { ApiError } from '../../utils/ApiError.js';

// describe() keeps related tests together in a group
describe('ApiError', () => {
    // Basic object creation
    test('should create an ApiError with all custom values', () => {
        // Arrange
        const validationErrors = {
            email: 'Email is required',
            password: 'Password is too short',
        };

        // Act
        const error = new ApiError(400, 'Validation Failed', validationErrors);

        // Assert
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe('Validation Failed');
        expect(error.errors).toEqual(validationErrors);
        expect(error.success).toBe(false);
        expect(error.data).toBeNull();
    });

    // Default constructor values
    test('should use default message and empty errors object', () => {
        const error = new ApiError(500);
        expect(error.message).toBe('Something went wrong!');
        expect(error.errors).toEqual({});
    });

    // Error inheritance
    test('should be an instance of Error', () => {
        const error = new ApiError(500);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(ApiError);
    });

    // success flag
    test('should always have success as false', () => {
        const error = new ApiError(200);
        expect(error.success).toBe(false);
    });

    // data field
    test('should always keep data as null', () => {
        const error = new ApiError(404);
        expect(error.data).toBeNull();
    });

    // Validation errors
    test('should store validation errors', () => {
        const validationErrors = {
            email: 'Email is required',
            password: 'Password is too short',
        };

        const error = new ApiError(400, 'Validation Failed', validationErrors);
        expect(error.errors).toEqual(validationErrors);
    });
-
    // Custom stack
    test('should use provided custom stack trace', () => {
        const customStack = 'My Custom Stack trace';
        const error = new ApiError(500, 'Server Error', {}, customStack);
        expect(error.stack).toBe(customStack);
    });

    // Auto-generated stack
    test('should automatically generate stack trace', () => {
        const error = new ApiError(500);
        expect(error.stack).toBeDefined();
    });
});
