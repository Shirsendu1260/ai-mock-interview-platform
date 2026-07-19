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
			logoClass: 'h-13 w-13',
			titleClass: 'text-[1.65rem]',
			subtitleClass: 'text-xs'
		},
		lg: {
			logoClass: 'h-17 w-17',
			titleClass: 'text-5xl',
			subtitleClass: 'text-sm'
		}
	};

	const currentSize = sizeMap[size];

	return (
		<div className='flex items-center gap-4'>
			{/* Brand icon */}
			<img
				src={logo}
				alt={`${APP_NAME} logo`}
				className={`${currentSize.logoClass} rounded-2xl shadow-sm`}
			/>

			{/* Brand text */}
			<div className='leading-tight'>
				<h1 className={`font-extrabold tracking-tight text-dark ${currentSize.titleClass}`} >
					{APP_NAME}
				</h1>
				<p className={`font-medium tracking-wide text-muted ${currentSize.subtitleClass}`} >
					AI-Powered Interview Practice
				</p>
			</div>
		</div>
	);
};

export default Logo;
