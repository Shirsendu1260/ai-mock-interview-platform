import type { Request, Response, NextFunction } from "express";
import { users } from "../db/schema/index.js";

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

export type {
	IErrorMessage,
	AsyncControllerFunction
};