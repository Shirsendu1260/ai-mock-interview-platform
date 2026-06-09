import { useEffect } from 'react';
import { getAuthUser } from '../api/auth.api.js';
import { useAuthStore } from '../stores/auth.store.js';

// Runs only when the application starts
// Calls - GET /get-auth-user
// Backend verifies the JWT stored in secure cookie, then returns 'user' object if the JWT is valid
// Updates Zustand store
// From that moment, application knows user is logged in
// This prevents unnecessary login screens after page refreshes
const useAuthInitialization = async () => {
	const { setUser, setIsLoading, clearUser } = useAuthStore();

	useEffect(() => {
		const initAuth = async () => {
			try {
				const response = await getAuthUser();

				if(response.data.success) {
					const user = response.data.data;

					// User is authenticated, and 'user' object is returned
					// So update Zustand store to set 'user' object globally
					setUser(user);
				}
				// Not authenticated
				else {
					clearUser();
				}
			}
			catch {
				// Logs out user if any error occurs
				clearUser();
			}
			finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);
};

export default useAuthInitialization;