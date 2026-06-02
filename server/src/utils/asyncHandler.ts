import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { AsyncControllerFunction } from '../types/types.js';

// Using promises
const asyncHandler = (requestHandler: AsyncControllerFunction): RequestHandler => {
	// This returns a new Express middleware function that will be executed in applied routes
	// RequestHandler: this is Express's own built-in type for any middleware/controller function (req, res, next) => void
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
	}
}

export { asyncHandler };