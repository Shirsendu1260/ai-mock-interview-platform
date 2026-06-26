import { Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.jsx';
import Home from '../pages/Home.jsx';
import Auth from '../pages/Auth.jsx';
import Pricing from '../pages/Pricing.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import StartInterview from '../pages/StartInterview.jsx';
import InterviewHistory from '../pages/InterviewHistory.jsx';
import Profile from '../pages/Profile.jsx';
import PublicRoute from './PublicRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import InterviewSession from '../pages/InterviewSession.jsx';
import InterviewResult from '../pages/InterviewResult.jsx';
import NotFound from '../pages/NotFound.jsx';

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
		      		{/*All child routes get '/dashboard' prefixed*/}
		      		<Route path='dashboard' element={<DashboardLayout/>}>
		      			{/*Default page when visiting /dashboard*/}
				        <Route index={true} element={<Dashboard/>} />

				        {/*interview related pages*/}
				        <Route path='interviews'>
				       		<Route path='create' element={<StartInterview/>} />
				        	<Route path='history' element={<InterviewHistory/>} />
				        	<Route path=':interviewId' element={<InterviewSession/>} />
						    <Route path=':interviewId/result' element={<InterviewResult/>} />
				        </Route>

				        {/*Profile*/}
				        <Route path='user'>
				        	<Route path='profile' element={<Profile/>} />
				        </Route>
				    </Route>
		      	</Route>

		      	{/*Error 404 route*/}
		      	<Route path='*' element={<NotFound/>} />
			</Route>
	    </Routes>
	)
}

export default AppRoutes
