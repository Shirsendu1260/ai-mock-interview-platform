// This file is for raw HTTP calls on auth routes

import { api } from './axios.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import type { AxiosResponse } from 'axios';
import type { User } from '../types/types.js';

const signInWithOAuth = (idToken: string): Promise<AxiosResponse<ApiResponse<User>>> => {
	return api.post(
		// Route URL
		'/user/sign-in/oauth',

		// Empty body, because backend expects req.headers.authorization, not req.body
		{},

		// Config
		{
			headers: { Authorization: `Bearer ${idToken}` }
		}
	);
};

/*
AxiosResponse<ApiResponse<AuthUser>> is:
{
    status: 200,
    headers: {...},
    config: {...},

    // ApiResponse
    data: {
        statusCode: 200,
        success: true,
        message: "...",

        // AuthUser
        data: {
            id: "...",
            email: "...",
            ...
        }
    }
}
*/

const refreshAccessToken = (): Promise<AxiosResponse<ApiResponse<{ 
	accessToken: string, refreshToken: string 
}>>> => {
    return api.post('/user/refresh-token');
};

const getAuthUser = (): Promise<AxiosResponse<ApiResponse<User>>> => {
	return api.get('/user/get-auth-user');
};

const signOut = (): Promise<AxiosResponse<ApiResponse<{}>>> => {
	return api.post('/user/sign-out');
};

export {
	signInWithOAuth,
	refreshAccessToken,
	getAuthUser,
	signOut
};
