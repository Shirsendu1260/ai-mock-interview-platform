import { NavLink } from 'react-router-dom';
import type { SidebarLinkProps } from '../../types/types.js';

// Shared sidebar link component
const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => {
	const Icon = icon;

	return (
		<NavLink
			to={to}

			end // Use exact match, so parent routes like /dashboard don't stay active when selected on
			// child routes such as /dashboard/interviews/create

			// NavLink passes { isActive } prop automatically
			// it is true when current url matches with 'to' prop
			// Based on that we are rendering classes
			className={({ isActive }) =>
				`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition
				${
					isActive
					? 'border-accent bg-accent text-white'
					: 'border-border bg-white text-muted hover:border-accent hover:text-accent'
				}`
			}
		>
			<Icon size={18} />
			<span>{label}</span>
		</NavLink>
	);
};

export default SidebarLink;
