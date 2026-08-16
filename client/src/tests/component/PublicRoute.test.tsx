import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';


// Mocks //

vi.mock('../../components/ui/Spinner.jsx', () => ({
    default: () => <div data-testid="loading-spinner">Loading</div>
}));

vi.mock('../../stores/auth.store.js', () => ({
    useAuthStore: vi.fn()
}));


// Import after mocks //

import PublicRoute from '../../routes/PublicRoute.jsx';
import { useAuthStore } from '../../stores/auth.store.js';


// Helper: set store state //

// Same pattern as ProtectedRoute tests
// PublicRoute also calls useAuthStore with selector functions
// We get those calls and return our fake state
const setAuthState = (fakeState: { isAuthenticated: boolean, isLoading: boolean }) => {
    vi.mocked(useAuthStore).mockImplementation((selectorFn: unknown) => {
        return selectorFn(fakeState)
    });
};

// Helper: render PublicRoute inside router //

// PublicRoute protects public pages like /auth (login page)
// If user is already logged in -> redirect to /dashboard
// If user is not logged in -> show the page (Outlet)
const renderPublicRoute = (startUrl = '/auth') => {
    return render(
        <MemoryRouter initialEntries={[startUrl]}>
            <Routes>
                {/*PublicRoute wraps the /auth route*/}
                {/*If user is not authenticated -> show Auth page*/}
                {/*If user IS authenticated -> redirect to /dashboard*/}
                <Route element={<PublicRoute />}>
                    <Route
                        path="/auth"
                        element={<div data-testid="auth-page">Auth Page</div>}
                    />
                </Route>

                {/*Where authenticated users get redirected*/}
                <Route
                    path="/dashboard"
                    element={<div data-testid="dashboard-page">Dashboard</div>}
                />
            </Routes>
        </MemoryRouter>
    )
};


// Tests //

describe('PublicRoute', () => {
    // Before each test, reset all mocks
    beforeEach(() => {
        vi.clearAllMocks()
    });


    // Loading state //

    test('should show loading spinner while auth state is loading', () => {
        // When app starts, we don't know if user is logged in yet
        // Show spinner until we know
        setAuthState({ isAuthenticated: false, isLoading: true });

        renderPublicRoute();

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('should not show page content while loading', () => {
        setAuthState({ isAuthenticated: false, isLoading: true });

        renderPublicRoute();

        // While loading, neither the auth page nor the dashboard should show
        expect(screen.queryByTestId('auth-page')).not.toBeInTheDocument();
        expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    })


    // Already authenticated //

    test('should redirect to /dashboard when user is already authenticated', () => {
        // User is already logged in and tries to visit /auth (login page)
        // PublicRoute should redirect them to dashboard
        // This prevents showing login screen to already logged-in users
        setAuthState({ isAuthenticated: true, isLoading: false });

        renderPublicRoute();

        // Dashboard should appear, user was redirected there
        expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    test('should not show auth page when user is authenticated', () => {
        setAuthState({ isAuthenticated: true, isLoading: false });

        renderPublicRoute();

        // Auth/login page must not be visible, user was redirected away
        expect(screen.queryByTestId('auth-page')).not.toBeInTheDocument();
    })


    // Not authenticated //

    test('should show auth page when user is not authenticated', () => {
        // User is not logged in -> they should see the login page
        setAuthState({ isAuthenticated: false, isLoading: false });

        renderPublicRoute();

        expect(screen.getByTestId('auth-page')).toBeInTheDocument();
    });

    test('should not redirect to /dashboard when user is not authenticated', () => {
        setAuthState({ isAuthenticated: false, isLoading: false });

        renderPublicRoute();

        expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument();
    });

    test('should not show spinner when loading is done', () => {
        setAuthState({ isAuthenticated: false, isLoading: false });

        renderPublicRoute();

        expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
});
