import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar.jsx';

const DashboardLayout = () => {
	return (
		<div className='bg-background'>
			<div className='flex'>
				{/*sidebar*/}
				<DashboardSidebar />

				{/*main content*/}
				<main className='flex-1 p-7'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default DashboardLayout;