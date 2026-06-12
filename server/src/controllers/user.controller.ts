import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { COOKIE_SEND_OPTIONS } from '../constants.js';
import { db } from '../config/db.js';
import { users } from '../db/schema/users.js';
import type { NewUser } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';
import { admin } from '../config/firebaseAdmin.config.js';
import { generateAccessAndRefreshTokens } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';
import type { JwtPayload, Secret } from 'jsonwebtoken';


// LOGIN OR REGISTER USER VIA OAUTH
const oAuthUserLoginOrRegister = asyncHandler(async (req, res) => {
	// Frontend: Authenticates with Firebase (Google/GitHub) -> gets an ID Token (a JWT signed by Firebase).
	// Frontend: Sends that ID Token to our backend in the Authorization header.
	// Backend: Verifies the ID token using the firebase-admin SDK. If valid, Firebase extracts the 
	// 		    secure name, email, and picture.
    // Backend: Checks the database, registers/logs in the user, and 
	// 		    sets our own tokens.

    // Frontend
    //     V
    // Firebase Google/GitHub Sign-In
    //     V
    // Firebase ID Token
    //     V
    // POST /api/v1/user/sign-in/oauth
    // Authorization: Bearer <firebase-id-token>
    //     V
    // Backend verifies token via firebase-admin SDK
    //     V
    // Find/Create user
    //     V
    // Generate JWT tokens
    //     V
    // One of them, i.e. refresh token gets saved in db
    //     V
    // Set those JWT tokens in HTTP-only secure cookie
    //     V
    // Frontend receives user data
    //     V
    // Store user inside Zustand

    // Extract the token from Authorization Header
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'Unauthorized: No token provided.');
    }

    const idToken = authHeader.split(' ')[1];
    if(!idToken) {
        throw new ApiError(401, 'Unauthorized: No token provided.');
    }

	// Verify token validity directly with Firebase to collect data
    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    }
    catch(error) {
        throw new ApiError(401, 'Unauthorized: Invalid or expired token.');
    }

    // Collect data verified by Google/GitHub (at this point data is valid)
	const { name, email, picture } = decodedToken as { 
        name?: string; 
        email?: string; 
        picture?: string
    };
    
    if (!email) {
        throw new ApiError(400, 'OAuth provider did not return a valid email.');
    }

    // Check if the user already exists or not
    const existingUser = await db.select({
                                        id: users.id,
                                        fullName: users.fullName,
                                        email: users.email,
                                        avatarUrl: users.avatarUrl,
                                        credit: users.credit,
                                        createdAt: users.createdAt,
                                        updatedAt: users.updatedAt
                                    })
        							.from(users)
        							.where(eq(users.email, email))
        							.limit(1);

    let userToAuthenticate = existingUser[0];

    // If user exists, log them in, else register them
    // Register User IF Block
    if(!userToAuthenticate) {
        const newUser: NewUser = {
            email,
            fullName: name || 'New User',
            avatarUrl: picture || null
            // credit is default (300)
            // createdAt/updatedAt handled automatically
        };

        const insertResult = await db.insert(users)
                                        .values(newUser)
                                        .returning({
                                            id: users.id,
                                            fullName: users.fullName,
                                            email: users.email,
                                            avatarUrl: users.avatarUrl,
                                            credit: users.credit,
                                            createdAt: users.createdAt,
                                            updatedAt: users.updatedAt
                                        });

        userToAuthenticate = insertResult[0];

        if (!userToAuthenticate) {
            throw new ApiError(500, 'Unable to register the user, please try again.');
        }
    }

    // Generate access and refresh token (works for both login and register)
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(userToAuthenticate.id);

    // Return reponse
    return res.status(200)
                .cookie('accessToken', accessToken, COOKIE_SEND_OPTIONS) // send token via cookie
			    .cookie('refreshToken', refreshToken, COOKIE_SEND_OPTIONS) // send token via cookie
			    .json(
			        new ApiResponse(200, userToAuthenticate, 'User authenticated successfully.')
			    );
});


// REFRESH ACCESS TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
    // Collect refresh token from cookie
    const userCollectedRefreshToken: string | undefined = req.cookies.refreshToken;

    if(!userCollectedRefreshToken) {
        throw new ApiError(401, 'Unauthorized request.');
    }

    try {
        // Verify the collected refresh token with one that resides in server (DB)
        const secretKey = process.env.REFRESH_TOKEN_SECRET_KEY;
        if(!secretKey) throw new ApiError(500, 'REFRESH_TOKEN_SECRET_KEY is not defined.');
        const secret: Secret = secretKey;

        const decodedUserCollectedRefreshToken = jwt.verify(userCollectedRefreshToken, secret) as JwtPayload;

        // Get user details with the help of decoded refresh token's payload ********/
        const [user] = await db.select()
                                .from(users)
                                .where(eq(users.id, decodedUserCollectedRefreshToken.id))
                                .limit(1);
        
        if(!user) {
            throw new ApiError(401, 'Invalid refresh token.');
        }

        // Check both refresh tokens are same or not, if same then user is authenticated
        if(userCollectedRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Refresh token is expired or used.');
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

        // Send successful response with the tokens sent through cookie
        return res.status(200)
                    .cookie('accessToken', accessToken, COOKIE_SEND_OPTIONS)
                    .cookie('refreshToken', refreshToken, COOKIE_SEND_OPTIONS)
                    .json(
                        new ApiResponse(200, { accessToken, refreshToken }, 'Access token is refreshed successfully.')
                    );
    }
    catch(error: unknown) {
        if (error instanceof ApiError) throw error
        throw new ApiError(401, error instanceof Error ? error.message : 'Invalid refresh token');
    }
});


//  GET CURRENT AUTHENTICATED USER
const getAuthUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, 'Authenticated user is fetched successfully.')
    )
});


// USER LOGOUT
const signOutUser = asyncHandler(async (req, res) => {
    await db.update(users)
            .set({
                refreshToken: null,
                updatedAt: new Date()
            })
            .where(eq(users.id, req.user?.id));

    return res.status(200)
                .clearCookie('accessToken', COOKIE_SEND_OPTIONS)
                .clearCookie('refreshToken', COOKIE_SEND_OPTIONS)
                .json(new ApiResponse(200, {}, 'User signed out successfully.')); // {} -> sending empty data
});


export {
	oAuthUserLoginOrRegister,
    refreshAccessToken,
    getAuthUser,
    signOutUser
};