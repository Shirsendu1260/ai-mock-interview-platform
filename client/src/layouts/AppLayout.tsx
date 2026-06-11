import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

// AppLayout gives the common structure for every page
// Structure: Navbar - Page content - Footer
// React Router injects the current page content (React component) inside <Outlet/>
// So structure actually becomes: Navbar - Page content rendered by <Outlet/> - Footer
const AppLayout = () => {
	return (
		<div className='flex min-h-screen flex-col'>
			<Navbar/>

			{/*Main content
			'flex-1' makes the page content expand and pushes Footer to bottom*/}
			<main className='flex-1'>
				{/*If we visit '/' for example, <Outlet/> becomes </Home/>*/}
				<Outlet/>
			</main>

			<Footer/>
		</div>
	)
}

export default AppLayout