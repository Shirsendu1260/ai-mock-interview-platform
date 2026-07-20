import { BsGithub, BsLinkedin } from 'react-icons/bs';
import Logo from '../common/Logo.jsx';
import {
	APP_NAME,
	DEVELOPER,
	SOCIAL_LINKS
} from '../../constants/app.js';
import { LAYOUT } from '../../constants/design.js';

const Footer = () => {
	return (
		<footer className='border-t border-border bg-background'>
			<div className={`${LAYOUT.maxWidth} ${LAYOUT.paddingX} mx-auto py-11`}>
				<div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
					{/* Left */}
					<div className='space-y-4'>
						<Logo />
						<div className='space-y-0.5 text-sm text-muted'>
							<p>Practice technical interviews with AI.</p>
							<p>&copy; {new Date().getFullYear()} {APP_NAME}</p>
							<p>
								Built by{' '}
								<span className='font-semibold text-dark'>{DEVELOPER.name}</span>
							</p>
						</div>
					</div>

					{/* Right */}
					<div className='flex items-center gap-3'>
						<a
							href={SOCIAL_LINKS.github}
							target='_blank'
							rel='noopener noreferrer'
							className='
								flex h-12 w-12 items-center justify-center
								rounded-xl border border-2 border-border bg-background
								transition-all duration-200
								hover:border-accent hover:text-accent
							'
						>
							<BsGithub size={18} />
						</a>

						<a
							href={SOCIAL_LINKS.linkedin}
							target='_blank'
							rel='noopener noreferrer'
							className='
								flex h-12 w-12 items-center justify-center
								rounded-xl border border-2 border-border bg-background
								transition-all duration-200
								hover:border-accent hover:text-accent
							'
						>
							<BsLinkedin size={18} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
