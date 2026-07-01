import { Link } from 'react-router-dom';
import { RiCopperCoinFill } from "react-icons/ri";
import { useAuthStore } from '../../stores/auth.store.js';
import type { NavbarLinksProps } from '../../types/types.js';
import UserDropdown from './UserDropdown.jsx';

const NavbarLinks = ({ isMobile = false }: NavbarLinksProps) => {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);
	const user = useAuthStore(state => state.user);

	return (
		<>
			<Link
				to='/'
				className='text-sm font-medium text-muted transition hover:text-accent'
			>
				Home
			</Link>

			<Link
				to='/pricing'
				className='text-sm font-medium text-muted transition hover:text-accent'
			>
				Pricing
			</Link>

			{
				isAuthenticated ? (
					<>
						<Link
							to='/dashboard'
							className='text-sm font-medium text-muted transition hover:text-accent'
						>
							Dashboard
						</Link>

						{
							// For large screens
							!isMobile && (
								<>
									<div
										className='
											flex items-center gap-1 rounded-xl
											border border-border bg-white px-3 py-2
											text-sm font-medium
										'
									>
										<RiCopperCoinFill size={16} className='text-yellow-400' />
										{user?.credit}
									</div>

									<UserDropdown/>
								</>
							)
						}
					</>
				) : (
					<Link
						to='/auth'
						className='rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white'
					>
						Sign In
					</Link>
				)
			}
		</>
	);
};

export default NavbarLinks;
