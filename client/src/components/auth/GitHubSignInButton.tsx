import { FaGithub } from "react-icons/fa";
import Button from '../ui/Button.jsx';
import type { ThirdPartySignInButtonProps } from '../../types/types.js';

const GitHubSignInButton = ({ onClick }: ThirdPartySignInButtonProps) => {
	return (
		<Button
			className='bg-primary flex items-center justify-center gap-3'
			onClick={onClick}
		>
			<FaGithub size={20} />
			<span>Continue with GitHub</span>
		</Button>
	)
}

export default GitHubSignInButton