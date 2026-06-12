import {
	FaHistory,
	FaPlusCircle,
	FaUser,
	FaHome
} from 'react-icons/fa';
import SidebarLink from './SidebarLink.jsx';

const DashboardSidebar = () => {
	return (
		<div className='w-64 shrink-0 border-r border-border bg-white p-5'>
			<div className='space-y-3'>
				<SidebarLink to='/dashboard' icon={FaHome} label='Dashboard' />
				<SidebarLink to='/dashboard/create' icon={FaPlusCircle} label='Create Interview' />
				<SidebarLink to='/dashboard/history' icon={FaHistory} label='History' />
				<SidebarLink to='/dashboard/profile' icon={FaUser} label='Profile' />
			</div>
		</div>
	);
};

export default DashboardSidebar;