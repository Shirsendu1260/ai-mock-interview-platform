import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import type { JwtPayload, Secret } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../config/db.js';
import { users, type PublicUser } from '../db/schema/users.js';
import type { Request, Response, NextFunction } from 'express';



// Express's Request type does not have a 'user' property by default, we add it by ourself
// 'user' Will be attached by verifyJWT middleware after token verification
declare global {
    namespace Express {
        interface Request {
            user?: PublicUser
        }
    }
}



export const verifyJWT = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
	try {
		/* Two sources for the token:
		Cookies -> browser clients (web apps)
		Authorization header -> mobile apps or Postman (Bearer <token>) */
		const accessToken: string | undefined = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', ''); // Authorization: Bearer abc123 -> Authorization: abc123

		if(!accessToken) {
		    throw new ApiError(401, 'Unauthorized: No token provided.');
		}

        const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
        if (!secretKey) throw new ApiError(500, "ACCESS_TOKEN_SECRET_KEY is not defined.");
        const secret: Secret = secretKey; // now safe to assign, guaranteed string

		// Decodes the token and returns the payload
        // jwt.verify() returns string | JwtPayload, we cast to JwtPayload to access .id safely
		const decodedAccessToken = jwt.verify(accessToken, secret) as JwtPayload;

		// If it passes, means user provided access token is valid (the user is authorized), 
		// then the access token payload is captured in 'decodedAccessToken', else it will not be available
		const result = await db.select({
                                    id: users.id,
                                    fullName: users.fullName,
                                    email: users.email,
                                    avatarUrl: users.avatarUrl,
                                    credit: users.credit,
                                    plan: users.plan,
                                    authProvider: users.authProvider,
                                    createdAt: users.createdAt,
                                    updatedAt: users.updatedAt
                                })
                                .from(users)
                                .where(eq(users.id, decodedAccessToken.id))
                                .limit(1);

        const user = result[0];

		if(!user) {
			throw new ApiError(401, 'Invalid access token.');
		}

		req.user = user;
		next();
	}
	catch(error: unknown) {
        if(error instanceof ApiError) throw error;
		throw new ApiError(
            401, 
            error instanceof Error ? error.message : 'Error while verifying token!'
        );
	}
});

export const verifyOptionalJWT = asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
    try {
        const accessToken: string | undefined = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

        // If user is not logged-in (token undefined), move to the controller, means unauthenticated user 
        // granted access for the applied route
        if(!accessToken) {
            return next();
        }

        const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
        if (!secretKey) throw new ApiError(500, "ACCESS_TOKEN_SECRET_KEY is not defined.");
        const secret: Secret = secretKey;

        // Decodde the payload
        const decodedAccessToken = jwt.verify(accessToken, secret) as JwtPayload;
        const result = await db.select({
                                    id: users.id,
                                    fullName: users.fullName,
                                    email: users.email,
                                    avatarUrl: users.avatarUrl,
                                    credit: users.credit,
                                    plan: users.plan,
                                    authProvider: users.authProvider,
                                    createdAt: users.createdAt,
                                    updatedAt: users.updatedAt
                                })
                                .from(users)
                                .where(eq(users.id, decodedAccessToken.id))
                                .limit(1);

        const user = result[0];

        if(!user) {
            throw new ApiError(401, 'Invalid access token.');
        }
        else {
            req.user = user;
        }

        next();
    }
    catch(error) {
        if(error instanceof ApiError) throw error;
        // For optional auth, if token is malformed, expired, or invalid,
        // just ignore it and continue as unauthenticated user
        return next();
    }
});

// // This middleware ensures that even if a user is authenticated, 
// // they can't access admin routes unless their flag is true
// export const verifyAdmin = (req: Request, _: Response, next: NextFunction) => {
//     // req.user is generated by our existing 'verifyJWT' middleware
//     if (!req.user?.isAdmin) {
//         throw new ApiError(403, 'Access denied. Admin access required.');
//     }
//     next();
// };
