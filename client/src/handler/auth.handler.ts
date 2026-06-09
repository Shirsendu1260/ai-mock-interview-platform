import { signInWithGoogle, signInWithGitHub } from '../utils/firebase.js'
import { signInWithOAuth } from '../api/auth.api.js';
import { useAuthStore } from '../stores/auth.store.js';
import type { UserCredential } from 'firebase/auth';

export const oAuthSignInHandler = async (provider: string): Promise<string> => {
	// Open Google OAuth popup, authenticate with Google/GitHub, and collect returned credential
	let credential: UserCredential;
	if(provider === 'google') {
		credential = await signInWithGoogle();
	}
	else if(provider === 'github') {
		credential = await signInWithGitHub();
	}
	else {
		return `Error 400: Invalid provider '${provider}'`;
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

		return `Success ${response.data.statusCode}: ${response.data.message || 'Success'}`;
	}

	return `Error ${response.data.statusCode}: ${response.data.message || 'Something went wrong!'}`;
};