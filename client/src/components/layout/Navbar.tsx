import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import { LAYOUT } from '../../constants/design.js';
import NavbarLinks from './NavbarLinks.jsx';

const Navbar = () => {
	return (
		<motion.header
			initial={{ opacity: 0, y: -15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='
				sticky top-0 z-50 py-1
				border-b border-border
				bg-white/90
				backdrop-blur-md
			'
		>
			<div
				className={`
					${LAYOUT.maxWidth}
					${LAYOUT.paddingX}
					mx-auto flex h-16 items-center justify-between
				`}
			>
				{/* Left side */}
				<Link to='/'>
					<Logo size='md' />
				</Link>

				{/* Right side */}
				<nav className='flex items-center gap-3 md:gap-5'>
					<NavbarLinks/>
				</nav>
			</div>
		</motion.header>
	);
};

export default Navbar;