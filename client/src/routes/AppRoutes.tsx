import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Auth from '../pages/Auth.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import PublicRoute from './PublicRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

// PublicRoute: Prevents authenticated users from visiting login pages
// ProtectedRoute: Prevents unauthenticated users from accessing private pages
const AppRoutes = () => {
	return (
		<Routes>
			{/* -------------------- Public Routes -------------------- */}
	      	<Route path='/' element={<Home/>} />

	      	<Route element={<PublicRoute/>}>
		      	<Route path='/auth' element={<Auth/>} />	      		
	      	</Route>

	      	{/* -------------------- Protected Routes -------------------- */}
	      	<Route element={<ProtectedRoute/>}>
	      		<Route path='/dashboard' element={<Dashboard/>} />
	      	</Route>
	    </Routes>
	)
}

export default AppRoutes