import type { Request, Response, NextFunction } from "express";
import type { User } from '../db/schema/users.js';

interface IErrorMessage {
	[key: string]: string; // key can be ANY string // value must be a string
};

// Type alias for any async Express controller function
// It takes (req, res, next) and returns a Promise
type AsyncControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> | Promise<Response> | void; 
// Promise<Response> -> Resolves to standard JSON response

// Express's Request type does not have a 'user' property by default, we add it by ourself
// 'user' Will be attached by verifyJWT middleware after token verification
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export type {
	IErrorMessage,
	AsyncControllerFunction
};