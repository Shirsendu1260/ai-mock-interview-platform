import type { LogoProps } from '../../types/types.js';
import { APP_NAME } from '../../constants/app.js';
import logo from '../../assets/logo.png';

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
			logoClass: 'h-10 w-10',
			titleClass: 'text-lg',
			subtitleClass: 'text-[11px]'
		},
		md: {
			logoClass: 'h-12 w-12',
			titleClass: 'text-2xl',
			subtitleClass: 'text-xs'
		},
		lg: {
			logoClass: 'h-16 w-16',
			titleClass: 'text-4xl',
			subtitleClass: 'text-sm'
		}
	};

	const currentSize = sizeMap[size];

	return (
		<div className='flex items-center gap-3'>
			{/* Brand icon */}
			<img
				src={logo}
				alt={`${APP_NAME} logo`}
				className={`${currentSize.logoClass} rounded-2xl`}
			/>

			{/* Brand text */}
			<div className='leading-tight'>
				<h1 className={`font-bold tracking-tight text-dark ${currentSize.titleClass}`} >
					{APP_NAME}
				</h1>
				<p className={`font-medium text-muted ${currentSize.subtitleClass}`} >
					AI-Powered Interview Practice
				</p>
			</div>
		</div>
	);
};

export default Logo;
