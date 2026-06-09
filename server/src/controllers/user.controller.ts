import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { COOKIE_SEND_OPTIONS } from '../constants.js';
import { db } from '../config/db.js';
import { users } from '../db/schema/users.js';
import type { NewUser } from '../db/schema/users.js';
import { eq } from 'drizzle-orm';
import { generateAccessJWTToken } from '../utils/tokens.js';
import { admin } from '../config/firebaseAdmin.config.js';


// LOGIN OR REGISTER USER VIA OAUTH
const oAuthUserLoginOrRegister = asyncHandler(async (req, res) => {
	// Frontend: Authenticates with Firebase (Google/GitHub) -> gets an ID Token (a JWT signed by Firebase).
	// Frontend: Sends that ID Token to our backend in the Authorization header.
	// Backend: Verifies the ID token using the firebase-admin SDK. If valid, Firebase extracts the 
	// 		    secure name, email, and picture.
    // Backend: Checks the database, registers/logs in the user, and 
	// 		    sets our own session cookie.

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
    // Generate JWT
    //     V
    // Set that JWT access token in HTTP-only secure cookie
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
    const existingUser = await db
    							.select()
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

        const insertResult = await db.insert(users).values(newUser).returning();
        userToAuthenticate = insertResult[0];

        if (!userToAuthenticate) {
            throw new ApiError(500, 'Unable to register the user, please try again.');
        }
    }

    // Generate access token (works for both login and register)
    const accessToken = await generateAccessJWTToken(userToAuthenticate);

    // Return reponse
    return res.status(200)
			    .cookie('accessToken', accessToken, COOKIE_SEND_OPTIONS) // send token via cookie
			    .json(
			        new ApiResponse(200, userToAuthenticate, 'User authenticated successfully.')
			    );
});


//  GET CURRENT AUTHENTICATED USER
const getAuthUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, req.user, 'Authenticated user is fetched successfully.')
    )
});


// USER LOGOUT
const signOutUser = asyncHandler(async (_, res) => {
    return res.status(200)
                .clearCookie('accessToken', COOKIE_SEND_OPTIONS)
                .json(new ApiResponse(200, {}, 'User signed out successfully.')); // {} -> sending empty data
});


export {
	oAuthUserLoginOrRegister,
    getAuthUser,
    signOutUser
};