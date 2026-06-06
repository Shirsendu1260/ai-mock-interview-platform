import { FcGoogle } from "react-icons/fc";
import Button from '../ui/Button.jsx';
import type { GoogleSignInButtonProps } from '../../types/types.js';

const GoogleSignInButton = ({ onClick }: GoogleSignInButtonProps) => {
	return (
		<Button
			className='bg-primary flex items-center justify-center gap-3'
			onClick={onClick}
		>
			<FcGoogle size={20} />
			<span>Continue with Google</span>
		</Button>
	)
}

export default GoogleSignInButton