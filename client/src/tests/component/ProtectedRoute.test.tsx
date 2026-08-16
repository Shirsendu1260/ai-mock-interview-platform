import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mocks //

// We mock the Spinner component because:
// 1. We don't want to test Spinner here, that's a separate concern
// 2. The real Spinner might have complex CSS/animations that don't work in jsdom
// 3. By replacing it with a simple div, we can easily check if it rendered
// 'default' because Spinner uses export default
vi.mock('../../components/ui/Spinner.jsx', () => ({
    default: () => <div data-testid="loading-spinner">Loading</div>
}));

// We mock the Zustand auth store because:
// ProtectedRoute reads isAuthenticated and isLoading from the store
// In tests, we don't want a real store with real state
// We want full control, we decide what the store returns in each test
vi.mock('../../stores/auth.store.js', () => ({
    // useAuthStore is a function that takes a selector fn. (example: state => state.isAuthenticated)
    // and returns a value
    // We replace it with vi.fn() so we can control its return value in each test
    useAuthStore: vi.fn()
}));


// Import after mocks //

// We import after vi.mock() calls because:
// vi.mock() is hoisted (moved to the top by Vitest automatically)
// But imports run in order, so we import after to be safe and clear
import ProtectedRoute from '../../routes/ProtectedRoute.jsx';
import { useAuthStore } from '../../stores/auth.store.js';


// Helper function //

// This helper sets up what useAuthStore returns for a test
// Instead of repeating this in every test, we call setAuthState({ isLoading: false, ... })
// HOW IT WORKS:
// ProtectedRoute calls useAuthStore like this:
// const isAuthenticated = useAuthStore(state => state.isAuthenticated)
// const isLoading = useAuthStore(state => state.isLoading)
// Each call passes a different selector function
// Our mock receives that selector function and calls it with our fakeState
// So when component asks for isAuthenticated, it gets fakeState.isAuthenticated
// When it asks for isLoading, it gets fakeState.isLoading
const setAuthState = (fakeState: { isAuthenticated: boolean, isLoading: boolean }) => {
    vi.mocked(useAuthStore).mockImplementation((selectorFn: unknown) => {
        // selectorFn is what the component passes, like: state => state.isAuthenticated
        // We call it with our fakeState so it returns the right value
        return selectorFn(fakeState)
    });
};


// Helper: render ProtectedRoute inside a real router setup //
// render(<ProtectedRoute />)
// Convert the component to its HTML inside jsdom
// Then we can query using 'screen'

// ProtectedRoute uses <Navigate> and <Outlet> from react-router-dom
// These components only work inside a Router context
// MemoryRouter gives us that context without needing a real browser
// We set up routes like this:
// /dashboard is inside ProtectedRoute (protected)
// /auth is the login page (where unauthenticated users get redirected)
// initialEntries tells MemoryRouter which URL we start on
const renderProtectedRoute = (startUrl = '/dashboard') => {
    return render(
        // MemoryRouter keeps the URL in memory (not in real browser address bar)
        // initialEntries is like typing a URL in the browser
        <MemoryRouter initialEntries={[startUrl]}>
            <Routes>
                {/*ProtectedRoute wraps the /dashboard route*/}
                {/*If user is authenticated -> show Dashboard*/}
                {/*If not -> redirect to /auth*/}
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/dashboard"
                        element={
                            // This is what renders when user is authenticated
                            // We use a simple div with a testid so we can easily check
                            // if it appeared
                            <div data-testid="dashboard-page">Dashboard Content</div>
                        }
                    />
                </Route>

                {/*This is where unauthenticated users get redirected*/}
                <Route
                    path="/auth"
                    element={<div data-testid="auth-page">Auth Page</div>}
                />
            </Routes>
        </MemoryRouter>
    )
}


// Tests //

describe('ProtectedRoute', () => {
    // Before each test, reset all mocks
    // This ensures one test's mock setup doesn't affect the next test
    beforeEach(() => {
        vi.clearAllMocks()
    })


    // Loading state //

    test('should show loading spinner when auth state is still loading', () => {
        // Arrange, isLoading is true, we don't know if user is authenticated yet
        // This happens when app first starts and is calling /get-auth-user
        setAuthState({ isAuthenticated: false, isLoading: true })

        // Act, render the component
        renderProtectedRoute()

        // Assert, spinner must be visible
        // The real spinner was mocked with a div that has data-testid="loading-spinner"
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    })

    test('should not show dashboard content while loading', () => {
        // When still loading, we don't know if user is authenticated
        // So neither dashboard nor redirect should happen yet
        setAuthState({ isAuthenticated: false, isLoading: true })

        renderProtectedRoute()

        // queryByTestId returns null if not found (getByTestId would throw)
        // We use queryBy when we expect the element to not be there
        expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument()
        expect(screen.queryByTestId('auth-page')).not.toBeInTheDocument()
    })


    // Unauthenticated //

    test('should redirect to /auth when user is not authenticated', () => {
        // Arrange, loading is done, user is not authenticated
        setAuthState({ isAuthenticated: false, isLoading: false })

        // Act
        renderProtectedRoute()

        // Assert, user should be on /auth page now
        // ProtectedRoute does: <Navigate to='/auth' replace />
        // MemoryRouter follows that redirect
        // So the auth page div should appear
        expect(screen.getByTestId('auth-page')).toBeInTheDocument()
    })

    test('should not show protected content when user is not authenticated', () => {
        setAuthState({ isAuthenticated: false, isLoading: false })

        renderProtectedRoute()

        // Dashboard content must not be visible, user was redirected away
        expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument()
    })


    // Authenticated //

    test('should show protected content when user is authenticated', () => {
        // Arrange, loading is done, user IS authenticated
        setAuthState({ isAuthenticated: true, isLoading: false })

        // Act
        renderProtectedRoute()

        // Assert, dashboard content should be visible
        // ProtectedRoute renders <Outlet /> which React Router replaces with <Dashboard />
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
    })

    test('should not redirect to /auth when user is authenticated', () => {
        setAuthState({ isAuthenticated: true, isLoading: false })

        renderProtectedRoute()

        // Auth page must not appear, user stays on dashboard
        expect(screen.queryByTestId('auth-page')).not.toBeInTheDocument()
    })

    test('should not show spinner when loading is done and user is authenticated', () => {
        setAuthState({ isAuthenticated: true, isLoading: false })

        renderProtectedRoute()

        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument()
    })

})
