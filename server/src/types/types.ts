import type { Request, Response, NextFunction } from "express";
import type { DIFFICULTIES, INTERVIEW_STATUS } from "../constants.js";

interface IErrorMessage {
	[key: string]: string; // key can be any string // value must be a string
};
// {
//     role: "Role is required.",
//     yoe: "Years of experience is required.",
//     difficulty: "Difficulty is required.",
//     questionsCount: "Please select number of questions."
// }

// Type alias for any async Express controller function
// It takes (req, res, next) and returns a Promise
type AsyncControllerFunction = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> | Promise<Response> | void; 
// Promise<Response> -> Resolves to standard JSON response

type InterviewStatus = typeof INTERVIEW_STATUS[number];
type Difficulty = typeof DIFFICULTIES[number];

export type {
	IErrorMessage,
	AsyncControllerFunction,
	InterviewStatus,
	Difficulty
};
