import { PiBriefcaseFill } from "react-icons/pi";
import type { LogoProps } from '../../types/types.js';
import { APP_NAME } from '../../constants/app.js';

/*
Shared brand logo component used throughout the project.
Examples:
<Logo />
<Logo size="sm" />
<Logo size="lg" />
*/

const Logo = ({ size = "md" }: LogoProps) => {
	const sizeObj = {
		sm: { icon: 20, class: 'text-lg' },
		md: { icon: 28, class: 'text-2xl' },
		lg: { icon: 36, class: 'text-3xl' }
	};

	const currentSize = sizeObj[size]; // Contains our preferred icon size and class

	return (
		<div className="flex items-center justify-center gap-3">
			<div className="flex items-center justify-center rounded-xl bg-primary p-3 text-white">
				<PiBriefcaseFill size={currentSize.icon} />
			</div>
			<div>
				<h1 className={`font-bold text-dark ${currentSize.class}`}>{APP_NAME}</h1>
			</div>
		</div>
	)
}

export default Logo