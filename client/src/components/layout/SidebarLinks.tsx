import { NavLink } from 'react-router-dom';
import type { SidebarLinkProps } from '../../types/types.js';

// This component renders sidebar links (Profile, history etc.) in dashboard sidebar
const SidebarLinks = ({ to, icon, label }: SidebarLinkProps) => {
	const Icon = icon;
	
	return (
		<NavLink
			to={to}

			// NavLink passes { isActive } prop automatically
			// it is true when current url matches with 'to' prop
			// Based on that we are rendering classes
			className={({ isActive }) =>
				`flex items-center gap-3 rounded-2xl border px-4 py-3 transition
				${
					isActive
					? 'border-accent bg-accent text-white'
					: 'border-border bg-white text-muted hover:border-accent hover:text-accent'
				}`
			}
		>
			<Icon size={18} />
			<span className='text-sm font-medium'>{label}</span>
		</NavLink>
	);
};

export default SidebarLinks;