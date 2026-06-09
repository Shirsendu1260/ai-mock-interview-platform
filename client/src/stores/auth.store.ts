import { create } from 'zustand';
import type { User, AuthState } from '../types/types.js';

// Stores authenticated user data globally, so that components can use this centralized data
// by avoiding prop drilling problem.
// JWT is not stored here, stored in secure HTTP-only cookie, managed by browser.
export const useAuthStore = create<AuthState>((set) => ({
	// Initially user is not authenticated, that's why they are set as these
	user: null,
	isAuthenticated: false,
	isLoading: false,
	// Because when the app starts: App starts -> unknown auth status -> calls /get-auth-user -> cookie
	// sent automatically -> backend verifies JWT -> returns user -> update Zustand store
	// Until then, it will show 'Loading ....' with the help of isLoading = true
	// Not 'Logged out'
	// This prevents Bad UX such as Login page flashes then suddenly dashboard appears

	// Updates the user state and marks the application as authenticated
	setUser: (user: User | null) => set({
		user,
		isAuthenticated: !!user // 'user' exists -> !user is 'false' -> !!user is 'true'
	}),

	// Sets loading state for API call
	setIsLoading: (flag: boolean) => set({ isLoading: flag }),

	// Clears user state during logout
	clearUser: () => set({
		user: null,
		isAuthenticated: false
	})
}));