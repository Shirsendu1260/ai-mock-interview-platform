import { Link } from 'react-router-dom';
import { RiCopperCoinFill } from "react-icons/ri";

const NavbarLinks = () => {
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
				isAuthenticated
				? (
					<>
						<Link
							to='/dashboard'
							className='text-sm font-medium text-muted transition hover:text-accent'
						>
							Dashboard
						</Link>

						<div
							className=
							'rounded-xl border border-border bg-white px-3 py-2 text-sm font-medium'
						>
							<RiCopperCoinFill size='15' /> {user?.credit}
						</div>

						<img
							src={user?.avatarUrl ?? ''}
							alt={user?.fullName}
							className='h-10 w-10 rounded-full border border-border object-cover'
						/>
					</>
				) : (
					<Link
						to='/auth'
						className='
							rounded-2xl border border-accent bg-accent px-5 py-2 text-sm
							font-medium text-white transition hover:opacity-90
						'
					>
						Sign In
					</Link>
				)
			}
		</>
	);
};

export default NavbarLinks;