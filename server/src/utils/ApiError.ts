import type IErrorMessage from '../types/types.js';

class ApiError extends Error {
	public statusCode: number;
	public data: null;
	public success: boolean;
	public errors: IErrorMessage[];

	constructor(
		statusCode: number, // HTTP status code (e.g., 400, 404, 500)
		message: string = 'Something went wrong!', // Error message (default if none provided)
		errors: IErrorMessage[] = [], // Array of detailed error message objects (e.g., validation errors such as "Password is required", "Password must be 8 characters")
		errorStack: string = '' // Optional custom stack trace
	) {
		super(message); 
		this.message = message;
		this.statusCode = statusCode;
		this.data = null; // Field to attach extra data (currently null to denote an error)
		this.success = false; // 'false' indicates failure
		this.errors = errors;

		if (errorStack) {
			this.stack = errorStack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

export { ApiError };