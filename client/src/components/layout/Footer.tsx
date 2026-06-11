import { BsGithub } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { LAYOUT } from '../../constants/design.js';
import { APP_NAME } from '../../constants/app.js';
import { SOCIAL_LINKS } from '../../constants/app.js';
import { DEVELOPER } from '../../constants/app.js';

// Displayed at the bottom of the pages
const Footer = () => {
	return (
		<footer className="border-t border-border bg-background">
			<div className={`${LAYOUT.maxWidth} ${LAYOUT.paddingX} flex flex-col gap-4 py-8 text-center md:flex-row md:items-center md:justify-between`}>
				<div className="space-y-1">
					<p className="text-sm text-muted">
						&copy; {new Date().getFullYear()} {APP_NAME}
					</p>
					<p className="text-sm text-muted">
						Developed by{' '}
						<span className="font-medium text-dark">{DEVELOPER.name}</span>
					</p>
				</div>

				<div className="flex justify-center gap-5">
					<a 
						href={SOCIAL_LINKS.github} 
						target="_blank" 
						rel='noopener noreferrer'
						className="transition hover:text-accent"
					>
						<BsGithub size={22} />
					</a>
					<a 
						href={SOCIAL_LINKS.linkedin} 
						target="_blank" 
						rel='noopener noreferrer'
						className="transition hover:text-accent"
					>
						<BsLinkedin size={22} />
					</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer