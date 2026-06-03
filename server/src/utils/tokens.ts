import jwt from 'jsonwebtoken';
import type { Secret, SignOptions } from 'jsonwebtoken';
import type { StringValue } from "ms";
import { ApiError } from './ApiError.js';
import type { User } from '../db/schema/users.js';

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

export { generateAccessJWTToken, generateRefreshJWTToken };