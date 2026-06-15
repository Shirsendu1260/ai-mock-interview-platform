import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/layout/DashboardSidebar.jsx';

const DashboardLayout = () => {
	return (
		<div className='bg-background min-h-screen'>
			<div className='flex'>
				{/*sidebar*/}
				<DashboardSidebar />

				{/*main content*/}
				<main className='flex-1 p-4 md:p-7'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
