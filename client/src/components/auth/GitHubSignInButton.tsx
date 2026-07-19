import { BsGithub } from "react-icons/bs";
import Button from '../ui/Button.jsx';
import type { ThirdPartySignInButtonProps } from '../../types/types.js';
import { useAuthStore } from '../../stores/auth.store.js';
import Spinner from "../ui/Spinner.js";

const GitHubSignInButton = ({ onClick }: ThirdPartySignInButtonProps) => {
	const authenticatingProvider = useAuthStore(state => state.authenticatingProvider);
	const isAuthenticating = authenticatingProvider !== null;

	return (
		<Button
			className='flex items-center justify-center gap-3 bg-primary shadow-sm hover:shadow-md'
			onClick={onClick}
			disabled={isAuthenticating}
			isLoading={authenticatingProvider === 'GitHub'}
		>
			{
				authenticatingProvider === 'GitHub'
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
