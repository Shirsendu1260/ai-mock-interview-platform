import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import { LAYOUT } from '../../constants/design.js';
import NavbarLinks from './NavbarLinks.jsx';
import { useState } from 'react';
import { RiMenuFill } from 'react-icons/ri';
import { HiX } from 'react-icons/hi';
import { useAuthStore } from '../../stores/auth.store.js';
import UserDropdown from './UserDropdown.jsx';

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const isAuthenticated = useAuthStore(state => state.isAuthenticated);

	return (
		<motion.header
			initial={{ opacity: 0, y: -15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='sticky top-0 z-50 border-b border-border bg-white/90 py-1 backdrop-blur-md'
		>
			<div className={`${LAYOUT.maxWidth} ${LAYOUT.paddingX} mx-auto`} >
				<div className='flex h-16 items-center justify-between'>
					{/* Logo */}
					<Link to='/'>
						<Logo size='md' />
					</Link>

					{/* Large screens, shown as flex, else hidden */}
					<nav className='hidden md:flex items-center gap-5'>
						<NavbarLinks />
					</nav>

					{/* Mobile screens, flex initially, else hidden for large screens */}
					<div className='flex items-center gap-5 md:hidden'>
						{
							isAuthenticated && (<UserDropdown/>)
						}

						<button
							onClick={() => setIsMenuOpen(prev => !prev)}
							className='rounded-xl border border-border bg-white p-2 transition hover:bg-background'
						>
							{
								isMenuOpen ? <HiX size={22} /> : <RiMenuFill size={22} />
							}
						</button>
					</div>
				</div>

				{/* Mobile menu */}
				<AnimatePresence>
					{/*AnimatePresence allows components to animate while leaving the DOM.
					Without it:
					isMenuOpen=false -> React destroys the component immediately.
					With AnimatePresence:
					React waits until the exit animation finishes and only then removes the component.*/}
					{
						isMenuOpen && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.25 }}
								className='overflow-hidden md:hidden'
							>
								<div className='flex flex-col gap-5 border-t border-border py-5 text-right'>
									<NavbarLinks isMobile={true} />
								</div>
							</motion.div>
						)
					}
				</AnimatePresence>
			</div>
		</motion.header>
	);
};

export default Navbar;
