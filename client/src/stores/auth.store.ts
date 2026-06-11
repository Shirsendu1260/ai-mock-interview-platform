import { create } from 'zustand';
import type { User, AuthState, OAuthProvider } from '../types/types.js';

// Stores authenticated user data globally, so that components can use this centralized data
// by avoiding prop drilling problem.
// JWT is not stored here, stored in secure HTTP-only cookie, managed by browser.
// Cookie = source of truth, Zustand = In-memory cache
// Every time the app starts: Cookie exists -> /get-auth-user -> Restore Zustand -> App closed -> Zustand store destroyed
export const useAuthStore = create<AuthState>((set) => ({
	// Initially user is not authenticated, that's why they are set as these
	user: null,
	oAuthProvider: null,
	isAuthenticated: false,
	isLoading: true,
	// Because when the app starts: App starts -> unknown auth status -> calls /get-auth-user -> cookie
	// sent automatically -> backend verifies JWT -> returns user -> update Zustand store
	// Until then, it will show Loading Spinner with the help of isLoading = true
	// Not 'Logged out'
	// This prevents Bad UX such as Login page flashes then suddenly dashboard appears

	isAuthenticating: false,

	// Updates the user state and marks the application as authenticated
	setUser: (user: User | null) => set({
		user,
		isAuthenticated: Boolean(user)
	}),

	// Sets provider string
	setOAuthProvider: (provider: OAuthProvider | null) => set({ oAuthProvider: provider }),

	// Sets loading state for API call
	setIsLoading: (flag: boolean) => set({ isLoading: flag }),

	// Sets the authenticating state when sign-in is in progress
	setIsAuthenticating: (flag: boolean) => set({ isAuthenticating: flag }),

	// Clears user state during logout
	clearUser: () => set({
		user: null,
		isAuthenticated: false,
		isAuthenticating: false
	})
}));