import { signInWithGoogle, signInWithGitHub } from '../utils/firebase.js'
import { signInWithOAuth, signOut } from '../api/auth.api.js';
import { useAuthStore } from '../stores/auth.store.js';
import type { UserCredential } from 'firebase/auth';
import type { OAuthProvider } from '../types/types.js';
import { ApiError } from '../utils/ApiError.js';

export const oAuthSignInHandler = async (provider: OAuthProvider): Promise<void> => {
	// Open Google OAuth popup, authenticate with Google/GitHub, and collect returned credential
	let credential: UserCredential;
	if(provider === 'google') {
		credential = await signInWithGoogle();
	}
	else if(provider === 'github') {
		credential = await signInWithGitHub();
	}
	else {
		throw new ApiError(400, `Invalid provider '${provider}'`);
	}

	// Get Firebase ID Token
	const idToken = await credential.user.getIdToken();

	// Send this token to our backend to validate the user via Firebase Admin SDk
	const response = await signInWithOAuth(idToken);

	if(response.data.success) {
		// If server successfully verifies this token, then user is authenticated, extract user object
		const user = response.data.data;

		// Update global Zustand store
		// Normally, const setUser = useAuthStore(...) can only be used inside React components
		// But this file is not a component
		// So, Zustand provides useAuthStore.getState(), which gives access to the store object anywhere
		// Now user object is globally available
		// 'user' object is set and 'isAuthenticated' is set to true 
		useAuthStore.getState().setUser(user);
	}
	else {
		throw new ApiError(response.data.statusCode, response.data.message || 'Something went wrong!');
	}
};

export const signOutHandler = async () => {
	const response = await signOut();

	if(response.data.success) {
		// Access & refresh token are already cleared from cookie by backend
		// Now just clear the Zustand 'user' state to completely sign out the user
		useAuthStore.getState().clearUser();
	}
	else {
		throw new ApiError(response.data.statusCode, response.data.message || 'Something went wrong!');
	}
};