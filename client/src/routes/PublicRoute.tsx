import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuthStore } from '../stores/auth.store.js';

// Prevents authenticated users from accessing authentication pages such as /auth
// If user is already authenticated, redirect him/her to the dashboard
const PublicRoute = () => {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const isLoading = useAuthStore(state => state.isLoading);
 
	// Authentication state is still being restored
	// Example: Browser refresh -> App starts again -> GET /get-auth-user -> waiting....
	if(isLoading) {
		return (
			<div className='min-h-screen flex justify-center items-center'>
				<Spinner size='lg' />
			</div>
		);
	}

	// Prevents showing login screen again
	if(isAuthenticated) {
		return <Navigate to='/dashboard' replace />
	}

	// User is not authenticated
	// Render child routes
	// <Route element={<PublicRoute />}>
	//   <Route path='/auth' element={<Auth />} />
	// </Route>
	// Flow:
	// User visits /auth -> PublicRoute executes -> User authenticated? -> No -> Render <Outlet/>
	// -> React Router replaces it with <Auth/>
	return <Outlet />;
};

export default PublicRoute;