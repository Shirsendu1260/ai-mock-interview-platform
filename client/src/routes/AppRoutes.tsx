import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home.jsx';
import Auth from '../pages/Auth.jsx';

const AppRoutes = () => {
	return (
		<Routes>
	      <Route path='/' element={<Home/>} />
	      <Route path='/login' element={<Auth/>} />
	    </Routes>
	)
}

export default AppRoutes