// It is similar to our verifyJWT() middleware from Express, which checks if 
// the user is logged in or not. If he/she is, system lets that user to visit that protected 
// route, else not/
// Backend:   router.get('/dashboard', verifyJWT, getDashboard);
// Similarly, in React, we do the same thing using <ProtectedRoute />
// Frontend:
// <Route element={<ProtectedRoute />}>
// 	 <Route path='/dashboard' element={<Dashboard />} />
// </Route>
// exactly the same idea

// Flow:
// If loading, show: <Spinner />, because authentication status is unknown
// If authenticated, allow access using <Outlet />. It is similar to next() from Express middleware
// which renders thd child routes.
// If unauthenticated, redirect to /auth. Similarly what we do in Express with res.status(401).

import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuthStore } from '../stores/auth.store.js';

const ProtectedRoute = () => {
	const { isAuthenticated, isLoading } = useAuthStore();

	// Show loading spinner while authentication status is being determined
	if(isLoading) {
		return (
			<div className='min-h-screen flex justify-center items-center'>
				<Spinner size='lg' />
			</div>
		);
	}

	// Redirect unauthenticated users to /auth
	// 'replace' attribute will remove current entry (/dashboard for example) in the browser History 
	// stack, replacing it with a new one (for here, /dashboard replaced by /auth when redirect 
	// happens)
	if(!isAuthenticated) {
		return <Navigate to='/auth' replace />
	}

	// Allow authenticated users to access protected routes
	// It is equivalent of Express's next() function.
	// Example:
	// <Route element={<ProtectedRoute />}>
	// 	 <Route path='/dashboard' element={<Dashboard />}
	// </Route>
	// Flow:
	// User vistis /dashboard -> ProtectedRoute executes first -> User authenticated? -> YES 
	// -> Render <Outlet /> -> React Router replaces <Outlet /> with <Dashboard />
	// So, <Outlet /> acts as a placeholder where nested child routes are rendered
	// Similar idea in Express:
	// verifyJWT(req, res, next) -> next() -> dashboardController()
	return <Outlet />;
};

export default ProtectedRoute;