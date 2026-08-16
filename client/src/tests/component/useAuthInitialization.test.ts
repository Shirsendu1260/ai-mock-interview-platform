import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mocks //

// We mock the getAuthUser API call because:
// We don't want real HTTP requests in tests
// We want to control what the server returns in each test
vi.mock('../../api/auth.api.js', () => ({
    // getAuthUser is the function that calls GET /user/get-auth-user
    // We replace it with a vi.fn() so we can control its response
    getAuthUser: vi.fn()
}))

// We mock the auth store because:
// useAuthInitialization calls setUser, clearUser, setIsLoading from the store
// We want to verify which store functions were called and with what arguments
// Without mocking, we would need a real Zustand store which complicates things
vi.mock('../../stores/auth.store.js', () => ({
    useAuthStore: vi.fn()
}));


// Import after mocks //

import useAuthInitialization from '../../hooks/useAuthInitialization.js';
import { getAuthUser } from '../../api/auth.api.js';
import { useAuthStore } from '../../stores/auth.store.js';

// Fake data //

// A fake user object, same shape as what the real backend would return
const mockUser = {
    id: 'user-uuid-123',
    fullName: 'Test User',
    email: 'test@gmail.com',
    avatarUrl: 'https://photo.url/pic.jpg',
    credit: 100,
    plan: 'free',
    authProvider: 'Google',
    createdAt: new Date(),
    updatedAt: new Date()
};


// Tests //

describe('useAuthInitialization', () => {
    // These are the Zustand store functions that the hook calls
    let mockSetUser: ReturnType<typeof vi.fn>;
    let mockSetIsLoading: ReturnType<typeof vi.fn>;
    let mockClearUser: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Create fresh mock functions before each test
        // This ensures one test's calls don't leak into the next test
        mockSetUser = vi.fn();
        mockSetIsLoading = vi.fn();
        mockClearUser = vi.fn();

        // useAuthStore is called like this in the hook:
        // const setUser = useAuthStore(state => state.setUser)
        // const setIsLoading = useAuthStore(state => state.setIsLoading)
        // const clearUser = useAuthStore(state => state.clearUser)
        // Our mock gets these calls
        // The selectorFn receives our fake state object
        // It returns the right function based on which state key was requested
        vi.mocked(useAuthStore).mockImplementation((selectorFn: unknown) => {
            // This is our fake store state
            // The selector picks whichever function it needs
            const fakeStoreState = {
                setUser: mockSetUser,
                setIsLoading: mockSetIsLoading,
                clearUser: mockClearUser
            };

            return selectorFn(fakeStoreState);
        });
    });

    // Before each test, reset all mocks
    afterEach(() => {
        vi.clearAllMocks();
    });


    // Successful auth //

    test('should call setUser with user data when getAuthUser succeeds', async () => {
        // Arrange
        // Make getAuthUser return a successful response with our fake user
        // This simulates the backend returning a logged-in user
        vi.mocked(getAuthUser).mockResolvedValue({
            data: {
                success: true,
                data: mockUser, // the user object from backend
                statusCode: 200,
                message: 'Authenticated user is fetched successfully.'
            }
        } as unknown);

        // Act
        // renderHook renders our hook just like render() renders a component
        // It returns a 'result' object which contains the hook's return value
        // Our hook doesn't return anything (it just calls fake Zustand store functions inside it)
        // So we mainly use it to trigger the hook's useEffect
        // Normally, render() is used to render a React component
        // Example: render(<MyComponent />)
        // But sometimes we want to test a custom React Hook directly
        // without creating a component just for the test
        // renderHook() creates a small test environment for the Hook
        // It runs the Hook and lets us check the Hook's returned values and behavior
        // Simple idea:
        // render()     -> renders a component
        // renderHook() -> runs a Hook
        renderHook(() => useAuthInitialization());

        // Some React code does not finish immediately
        // For example, a Hook may run a useEffect() that makes an API request
        // The API request finishes later, not immediately when the Hook starts
        // waitFor() repeatedly checks our condition until it becomes true
        // This gives the async operation time to finish before we make our assertion
        // Without waitFor():
        // Hook starts -> async work is still running -> test checks too early -> test may fail
        // With waitFor():
        // Hook starts -> wait for async work -> check the result -> assertion passes
        await waitFor(() => {
            // setUser should have been called with our mockUser
            // This means the hook correctly stored the authenticated user in Zustand
            expect(mockSetUser).toHaveBeenCalledWith(mockUser);
        });
    });

    test('should call setIsLoading(true) at the start and setIsLoading(false) at the end', async () => {
        // The hook sets loading=true when it starts
        // and loading=false when it finishes (whether success or failure)
        // This ensures the spinner shows while checking auth status
        vi.mocked(getAuthUser).mockResolvedValue({
            data: {
                success: true,
                data: mockUser,
                statusCode: 200,
                message: 'Success'
            }
        } as unknown);

        renderHook(() => useAuthInitialization());

        await waitFor(() => {
            expect(mockSetIsLoading).toHaveBeenCalledWith(true);
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
            expect(mockSetIsLoading).toHaveBeenCalledTimes(2);
        });
    });


    // Failed auth //

    test('should call clearUser when getAuthUser returns success: false', async () => {
        // The backend responded but says user is not authenticated
        // For example, the JWT cookie is missing or invalid
        vi.mocked(getAuthUser).mockResolvedValue({
            data: {
                success: false, // not authenticated
                data: null,
                statusCode: 401,
                message: 'Unauthorized'
            }
        } as unknown);

        renderHook(() => useAuthInitialization());

        await waitFor(() => {
            // clearUser removes the user from Zustand store
            // This means the app will know the user is not logged in
            expect(mockClearUser).toHaveBeenCalledTimes(1);
        });
    });

    test('should not call setUser when getAuthUser returns success: false', async () => {
        vi.mocked(getAuthUser).mockResolvedValue({
            data: {
                success: false,
                data: null,
                statusCode: 401,
                message: 'Unauthorized'
            }
        } as unknown);

        renderHook(() => useAuthInitialization());

        await waitFor(() => {
            // setUser must not be called, user is not authenticated
            expect(mockSetUser).not.toHaveBeenCalled();
        });
    });


    // Network or server error //

    test('should call clearUser when getAuthUser throws an error', async () => {
        // getAuthUser throws, for example, network is down or server crashed
        // The catch block in the hook should call clearUser
        vi.mocked(getAuthUser).mockRejectedValue(new Error('Network Error'));

        renderHook(() => useAuthInitialization());

        await waitFor(() => {
            // Even on error, we clear the user
            // This logs out the user safely if something goes wrong
            expect(mockClearUser).toHaveBeenCalledTimes(1);
        });
    });

    test('should still call setIsLoading(false) even when an error occurs', async () => {
        // The finally block runs whether there is success or error
        // So setIsLoading(false) must always be called
        vi.mocked(getAuthUser).mockRejectedValue(new Error('Server Error'));

        renderHook(() => useAuthInitialization());

        await waitFor(() => {
            // setIsLoading(false) must be called in the finally block
            expect(mockSetIsLoading).toHaveBeenCalledWith(false);
        });
    });
});
