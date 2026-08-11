import { describe, test, expect } from 'vitest';
import { ApiResponse } from '../../utils/ApiResponse.js';

// describe() keeps related tests together in a group
// It makes output clean
describe('ApiResponse', () => {
    // Success responses (2xx) //

    test('should set success to true when statusCode is 200', () => {
        const response = new ApiResponse(200, { id: '123' }, 'OK');
        expect(response.success).toBe(true);
    });

    test('should set success to true when statusCode is 201', () => {
        const response = new ApiResponse(201, null, 'Created');
        expect(response.success).toBe(true);
    });

    test('should correctly store data and message', () => {
        // Arrange (setup mock data)
        const data = { userId: 'abc', email: 'test@test.com' };
        const message = 'User fetched successfully';

        // Act (function/API call)
        const response = new ApiResponse(200, data, message);

        // Assert (checks result)
        // Use .toEqual() because it checks on values between two objects unlike .toBe()
        // which checks references between two objects
        expect(response.data).toEqual(data);
        expect(response.message).toBe(message);
        expect(response.statusCode).toBe(200);
    });

    test('should handle null data correctly', () => {
        const response = new ApiResponse(200, null, 'Success');
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);
    });


    // Error responses (4xx, 5xx) //

    test('should set success to false when statusCode is 400', () => {
        const response = new ApiResponse(400, null, 'Bad Request');
        expect(response.success).toBe(false);
    });

    test('should set success to false when statusCode is 401', () => {
        const response = new ApiResponse(401, null, 'Unauthorized');
        expect(response.success).toBe(false);
    });

    test('should set success to false when statusCode is 404', () => {
        const response = new ApiResponse(404, null, 'Not Found');
        expect(response.success).toBe(false);
    });

    test('should set success to false when statusCode is 500', () => {
        const response = new ApiResponse(500, null, 'Internal Server Error');
        expect(response.success).toBe(false);
    });


    // Edge cases //

    test('should set success to true for statusCode 399', () => {
        // 399 < 400 -> success should be true
        const response = new ApiResponse(399, null, 'test');
        expect(response.success).toBe(true);
    });
});
