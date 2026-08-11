import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { AsyncControllerFunction } from '../types/types.js';

// higher order function wrapper for express route handlers
// express 4 standard routing does not automatically catch rejected promises in async functions
// without this wrapper or a manual try catch in every controller, any database error or unhandled
// promise rejection will crash the app or freeze the http request
const asyncHandler = (requestHandler: AsyncControllerFunction): RequestHandler => {
    // we return a standard express middleware signature (req, res, next)
    // making this inner function async is critical because it forces express to get back a promise
    // returning a promise allows unit testing frameworks like vitest/jest to await this middleware
    // execution completely before checking assertions for their testimg purpose
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Await the execution of the actual controller logic
            // If the controller returns a resolved promise (normal execution),
            // code finishes cleanly here and response is sent back to client
            await requestHandler(req, res, next);
        }
        catch(error) {
            // try catch block acts as a unified safety net for two distinct types of errors
            // type 1: synchronous runtime crashes like trying to read property of undefined (user.profile.name)
            // type 2: asynchronous promise rejections like db connection failures or failed fetch
            // calls, calling next(error) passes the caught error directly to express error handling middleware
            // express sees an argument in next() and immediately skips all remaining route handlers to execute
            // global error middleware
            next(error);
        }
    };

    // Why make the outer function return an async middleware?
    // It guarantees the wrapped function returns a Promise
    // When writing unit tests with frameworks
    // like Vitest or Jest, we can await controllerMiddleware(req, res, next) and be 100% sure all
    // execution, including error forwarding via next(error) completes before assertions run
};

export { asyncHandler };
