import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';
import { LAYOUT } from '../../constants/design.js';

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
					<Link
						to='/'
						className='text-sm font-medium text-muted transition hover:text-accent'
					>
						Home
					</Link>

					<Link
						to='/auth'
						className='
							rounded-2xl border border-accent bg-accent px-5 py-2 text-sm
							font-medium text-white transition hover:opacity-90
						'
					>
						Sign In
					</Link>
				</nav>
			</div>
		</motion.header>
	);
};

export default Navbar;