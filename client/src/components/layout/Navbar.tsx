import { motion } from "motion/react";
import { Link } from "react-router-dom";
import Logo from "../common/Logo.jsx";
import { LAYOUT } from "../../constants/design.js";

// Navbar is shared accross most pages
const Navbar = () => {
	return (
		<motion.header
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur'
		>
			<div className={`mx-auto flex h-16 ${LAYOUT.maxWidth} items-center justify-between ${LAYOUT.paddingX}`}>
				{/*Left side*/}
				<Link to='/'>
					<Logo size="md" />
				</Link>

				{/*Right side*/}
				<nav className="flex items-center gap-5">
					<Link to='/' className="text-sm font-medium text-muted transition hover:text-accent">
						Home
					</Link>
					<Link to='/auth' className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
						Sign In
					</Link>
				</nav>
			</div>
		</motion.header>
	)
}

export default Navbar