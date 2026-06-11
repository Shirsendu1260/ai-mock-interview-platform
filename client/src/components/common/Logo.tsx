import { PiBriefcaseFill } from 'react-icons/pi';
import type { LogoProps } from '../../types/types.js';
import { APP_NAME } from '../../constants/app.js';

/*
Shared brand logo component.
Examples:
<Logo />
<Logo size='sm' />
<Logo size='lg' />
*/

const Logo = ({ size = 'md' }: LogoProps) => {
	const sizeMap = {
		sm: {
			icon: 18,
			box: 'h-10 w-10',
			titleClass: 'text-lg',
			subtitleClass: 'text-[11px]'
		},
		md: {
			icon: 22,
			box: 'h-12 w-12',
			titleClass: 'text-2xl',
			subtitleClass: 'text-xs'
		},
		lg: {
			icon: 30,
			box: 'h-16 w-16',
			titleClass: 'text-4xl',
			subtitleClass: 'text-sm'
		}
	};

	const currentSize = sizeMap[size];

	return (
		<div className='flex items-center gap-3'>
			{/* Brand icon */}
			<div
				className={`
					${currentSize.box}
					flex items-center justify-center
					rounded-2xl bg-accent/6 text-primary border border-accent/20
				`}
			>
				<PiBriefcaseFill size={currentSize.icon} />
			</div>

			{/* Brand text */}
			<div className='leading-tight'>
				<h1 className={`font-bold tracking-tight text-dark ${currentSize.titleClass}`}>
					{APP_NAME}
				</h1>
				<p className={`font-medium text-muted ${currentSize.subtitleClass}`}>
					AI-Powered Interview Practice
				</p>
			</div>
		</div>
	);
};

export default Logo;