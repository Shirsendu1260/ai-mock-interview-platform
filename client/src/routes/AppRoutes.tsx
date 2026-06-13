import { Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';
import Home from '../pages/Home.jsx';
import Auth from '../pages/Auth.jsx';
import Pricing from '../pages/Pricing.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import CreateInterview from '../pages/CreateInterview.jsx';
import History from '../pages/History.jsx';
import Profile from '../pages/Profile.jsx';
import PublicRoute from './PublicRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// PublicRoute: Prevents authenticated users from visiting login pages
// ProtectedRoute: Prevents unauthenticated users from accessing private pages
const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<AppLayout/>}>
				{/* -------------------- Public Routes -------------------- */}
		      	<Route path='/' element={<Home/>} />
			    <Route path='/pricing' element={<Pricing/>} />

		      	<Route element={<PublicRoute/>}>
			      	<Route path='/auth' element={<Auth/>} />      		
		      	</Route>

		      	{/* -------------------- Protected Routes -------------------- */}
		      	<Route element={<ProtectedRoute/>}>
		      		<Route element={<DashboardLayout/>}>
				        <Route path='/dashboard' element={<Dashboard/>} />
				        <Route path='/interviews/create' element={<CreateInterview/>} />
				        <Route path='/history' element={<History/>} />
				        <Route path='/profile' element={<Profile/>} />
				    </Route>
		      	</Route>
			</Route>
	    </Routes>
	)
}

export default AppRoutes