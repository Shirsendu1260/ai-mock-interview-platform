import { useState } from 'react';
import { FaHistory, FaPlusCircle, FaUser, FaBookmark } from 'react-icons/fa';
import { PiBriefcaseFill } from 'react-icons/pi';
import { GoHomeFill } from 'react-icons/go';
import { RiMenuFill } from 'react-icons/ri';
import { HiX } from 'react-icons/hi';
import SidebarLink from './SidebarLink.jsx';

const sidebarLinks = [
	{
		id: 1,
		to: '/dashboard',
		icon: GoHomeFill,
		label: 'Dashboard'
	},
	{
		id: 2,
		to: '/dashboard/interviews/create',
		icon: FaPlusCircle,
		label: 'Create Interview'
	},
    {
		id: 3,
		to: '/dashboard/jobs/search',
		icon: PiBriefcaseFill,
		label: 'Job Search'
	},
    {
		id: 4,
		to: '/dashboard/jobs/bookmarks',
		icon: FaBookmark,
		label: 'Bookmarked Jobs'
	},
	{
		id: 5,
		to: '/dashboard/interviews/history',
		icon: FaHistory,
		label: 'History'
	},
	{
		id: 6,
		to: '/dashboard/user/profile',
		icon: FaUser,
		label: 'Profile'
	}
];

// Desktop: Sidebar always visible.
// Mobile: Sidebar hidden initially, clicking hamburger opens it
const DashboardSidebar = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<>
			{/* Mobile hamburger button */}
			<button
				onClick={() => setIsSidebarOpen(prev => !prev)}
				className='fixed left-4 top-22 z-60 rounded-xl border border-border bg-accent/50 p-2
				text-white shadow-sm font-sm md:hidden'
			>
				{
					isSidebarOpen
					? <HiX size={22} />
					: <RiMenuFill size={22} />
				}
			</button>

			{/* Dark overlay */}
			{
				isSidebarOpen && (
					<div
						onClick={() => setIsSidebarOpen(false)}
						className='fixed inset-0 z-40 bg-black/25 md:hidden'
					/>
				)
			}

			{/* Desktop sidebar */}
			<aside
				className='hidden min-h-screen w-64 flex-shrink-0 border-r border-border bg-white py-7 px-4 md:block'
			>
				<div className='space-y-3'>
					{
						sidebarLinks.map(link => (
							<SidebarLink
								key={link.id}
								to={link.to}
								icon={link.icon}
								label={link.label}
							/>
						))
					}
				</div>
			</aside>

			{/* Mobile sidebar */}
			<aside
				className={`
					fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-white px-4 py-20
					transition-transform duration-250 md:hidden
					${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
				`}
			>
				<div className='mt-16 space-y-3'>
					{
						sidebarLinks.map(link => (
							<SidebarLink
								key={link.id}
								to={link.to}
								icon={link.icon}
								label={link.label}
							/>
						))
					}
				</div>
			</aside>
		</>
	);
};

export default DashboardSidebar;
