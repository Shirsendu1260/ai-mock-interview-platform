import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import type { StringValue } from "ms";
import { ApiError } from './ApiError.js';
import type { User } from '../db/schema/users.js';
import { db } from '../config/db.js';
import { users } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';


const generateAccessJWTToken = async function(user: User): Promise<string> {
	// The payload (data to be embedded)
	const payload = {
		id: user.id,
		email: user.email,
		fullName: user.fullName
	};

	// This is the signature key. It ensures token cannot be modified
	const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY; // string | undefined at this stage
	if (!secretKey) throw new ApiError(500, "ACCESS_TOKEN_SECRET_KEY is not defined."); // if undefined
	const secret: Secret = secretKey; // now safe to assign, guaranteed string

	// Sign options for signature creation
	const signOptions: SignOptions = { // Default algo: HS256 (HMAC using SHA-256 hash algorithm)
		expiresIn: (process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRY || '12h') as StringValue // How long token is valid ("15m", "1h", "7d")		
	}

	return jwt.sign(payload, secret, signOptions);
};

const generateRefreshJWTToken = async function(user: User): Promise<string> {
	const payload = { id: user.id };

	const secretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
	if (!secretKey) throw new ApiError(500, "REFRESH_TOKEN_SECRET_KEY is not defined.");
	const secret: Secret = secretKey;

	const signOptions: SignOptions = {
		expiresIn: (process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRY || '7d') as StringValue
	};

	return jwt.sign(payload, secret, signOptions);
};

const generateAccessAndRefreshTokens = async (
    userId: User['id']
): Promise<{ accessToken: string, refreshToken: string }> => {
    try {
    	// As it returns array, to get first item, we did [user]
        const [user] = await db.select({
						        	id: users.id,
						        	fullName: users.fullName,
						        	email: users.email,
						        	avatarUrl: users.avatarUrl,
						        	credit: users.credit,
                                    plan: users.plan,
                                    firebaseUid: users.firebaseUid,
                                    refreshToken: users.refreshToken,
                                    authProvider: users.authProvider,
						        	createdAt: users.createdAt,
						        	updatedAt: users.updatedAt
						        })
    							.from(users)
    							.where(eq(users.id, userId))
    							.limit(1);
    	
    	if (!user) throw new ApiError(404, "User not found.");

        // generate access and refresh JWT token
        const accessToken = await generateAccessJWTToken(user);
        const refreshToken = await generateRefreshJWTToken(user);

        // Save refresh token in DB
        const [updatedUser] = await db.update(users)
        								.set({
        									refreshToken,
        									updatedAt: new Date()
        								})
        								.where(eq(users.id, userId))
        								.returning({ id: users.id });

        if (!updatedUser) throw new ApiError(404, "User not found.");

        return { accessToken, refreshToken };
    } catch(error: unknown) {
        // If what was thrown is already an ApiError (like the 404 above), just re-throw it as-is
        if(error instanceof ApiError) throw error;

        // Otherwise throw a generic 500
        throw new ApiError(500, error instanceof Error ? error.message : 'Unable to create access and refresh tokens.');
    }
};

export { generateAccessJWTToken, generateRefreshJWTToken, generateAccessAndRefreshTokens };
