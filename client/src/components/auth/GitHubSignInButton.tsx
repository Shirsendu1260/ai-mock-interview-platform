import { BsGithub } from "react-icons/bs";
import Button from '../ui/Button.jsx';
import type { ThirdPartySignInButtonProps } from '../../types/types.js';
import { useAuthStore } from '../../stores/auth.store.js';
import Spinner from "../ui/Spinner.js";

const GitHubSignInButton = ({ onClick }: ThirdPartySignInButtonProps) => {
	const isAuthenticating = useAuthStore(state => state.isAuthenticating);
	const oAuthProvider = useAuthStore(state => state.oAuthProvider);

	return (
		<Button
			className='bg-primary flex items-center justify-center gap-3'
			onClick={onClick}
			disabled={isAuthenticating}
			isLoading={isAuthenticating && oAuthProvider === 'github'}
		>
			{
				isAuthenticating && oAuthProvider === 'github'
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
