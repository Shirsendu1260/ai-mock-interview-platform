import {
	FaHistory,
	FaPlusCircle,
	FaUser,
	FaHome
} from 'react-icons/fa';
import SidebarLinks from './SidebarLinks.jsx';

const DashboardSidebar = () => {
	return (
		<div className='w-64 shrink-0 border-r border-border bg-white p-5'>
			<div className='space-y-3'>
				<SidebarLinks to='/dashboard' icon={FaHome} label='Dashboard' />
				<SidebarLinks to='/dashboard/create' icon={FaPlusCircle} label='Create Interview' />
				<SidebarLinks to='/dashboard/history' icon={FaHistory} label='History' />
				<SidebarLinks to='/user/profile' icon={FaUser} label='Profile' />
			</div>
		</div>
	);
};

export default DashboardSidebar;
