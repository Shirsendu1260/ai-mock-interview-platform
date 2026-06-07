import { BsMicrosoft } from "react-icons/bs";
import Button from '../ui/Button.jsx';
import type { ThirdPartySignInButtonProps } from '../../types/types.js';

const MicrosoftSignInButton = ({ onClick }: ThirdPartySignInButtonProps) => {
	return (
		<Button
			className='bg-primary flex items-center justify-center gap-3'
			onClick={onClick}
		>
			<BsMicrosoft size={20} />
			<span>Continue with Microsoft</span>
		</Button>
	)
}

export default MicrosoftSignInButton