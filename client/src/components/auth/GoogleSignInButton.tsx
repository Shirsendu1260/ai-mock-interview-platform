import { FcGoogle } from "react-icons/fc";
import Button from '../ui/Button.jsx';
import type { ThirdPartySignInButtonProps } from '../../types/types.js';
import { useAuthStore } from '../../stores/auth.store.js';
import Spinner from "../ui/Spinner.js";

const GoogleSignInButton = ({ onClick }: ThirdPartySignInButtonProps) => {
	const authenticatingProvider = useAuthStore(state => state.authenticatingProvider);
	const isAuthenticating = authenticatingProvider !== null;

	return (
		<Button
			className='flex items-center justify-center gap-3 bg-primary shadow-sm hover:shadow-md'
			onClick={onClick}
			disabled={isAuthenticating}
			isLoading={authenticatingProvider === 'Google'}
		>
			{
				authenticatingProvider === 'Google'
					? (
						<>
							<Spinner size="sm" />
							<span>Signing in with Google</span>
						</>
					)
					: (
						<>
							<FcGoogle size={20} />
							<span>Continue with Google</span>
						</>
					)
			}
		</Button>
	)
}

export default GoogleSignInButton
