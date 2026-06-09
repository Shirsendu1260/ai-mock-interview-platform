// This file is for raw HTTP calls on auth routes

import { api } from './axios.js';

const authAPI = {
	// Send Firebase issued ID Token to Backend, which then verifies the user, issues JWT 
	// and authenticates him/her
	signInWithOAuth: (idToken: string) => api.post(
		// Route URL
		'/user/sign-in/oauth',

		// Empty body, because backend expects req.headers.authorization, not req.body
		{},

		// Config
		{
			headers: { Authorization: `Bearer ${idToken}` }
		}
	),

	// Fetch currently authenticated user
	getAuthUser: () => api.get('/user/get-auth-user'),

	// Logs out that authenticated user
	signOut: () => api.post('/user/sign-out')
};

export {
	authAPI
};