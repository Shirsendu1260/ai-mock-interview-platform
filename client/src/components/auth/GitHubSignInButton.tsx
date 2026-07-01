import { BsGithub } from "react-icons/bs";
import Button from '../ui/Button.jsx';
import type { ThirdPartySignInButtonProps } from '../../types/types.js';
import { useAuthStore } from '../../stores/auth.store.js';
import Spinner from "../ui/Spinner.js";

const GitHubSignInButton = ({ onClick, provider }: ThirdPartySignInButtonProps) => {
	const isAuthenticating = useAuthStore(state => state.isAuthenticating);

	return (
		<Button
			className='bg-primary flex items-center justify-center gap-3'
			onClick={onClick}
			disabled={isAuthenticating}
			isLoading={isAuthenticating && provider === 'GitHub'}
		>
			{
				isAuthenticating && provider === 'GitHub'
					? (
						<>
							<Spinner size="sm" />
							<span>Signing in with GitHub</span>
						</>
					)
					: (
						<>
							<BsGithub size={20} />
							<span>Continue with GitHub</span>
						</>
					)
			}
		</Button>
	)
}

export default GitHubSignInButton
