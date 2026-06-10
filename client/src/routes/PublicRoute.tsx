import { Navigate, Outlet } from 'react-router-dom';
import Spinner from '../components/ui/Spinner.jsx';
import { useAuthStore } from '../stores/auth.store.js';

// Prevents authenticated users from accessing authentication pages such as /login
// If user is already authenticated, redirect him/her to the dashboard
const PublicRoute = () => {
	const { isAuthenticated, isLoading } = useAuthStore();

	// Authenticatio state is still being restored
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
		<Navigate to='/dashbaord' replace />
	}

	// User is not authenticated
	// Render child routes
	// <Route element={<PublicRoute />}>
	//   <Route path='/login' element={<Auth />} />
	// </Route>
	// Flow:
	// User visits /login -> PublicRoute executes -> User authenticated? -> No -> Render <Outlet/>
	// -> React Router replaces it with <Auth/>
	return <Outlet />;
};

export default PublicRoute;