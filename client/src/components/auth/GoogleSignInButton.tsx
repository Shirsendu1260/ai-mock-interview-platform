import { FcGoogle } from "react-icons/fc";
import Button from '../ui/Button.jsx';
import type { ThirdPartySignInButtonProps } from '../../types/types.js';
import { useAuthStore } from '../../stores/auth.store.js';
import Spinner from "../ui/Spinner.js";

const GoogleSignInButton = ({ onClick }: ThirdPartySignInButtonProps) => {
	const isAuthenticating = useAuthStore(state => state.isAuthenticating);

	return (
		<Button
			className='bg-primary flex items-center justify-center gap-3'
			onClick={onClick}
			disabled={isAuthenticating}
			isLoading={isAuthenticating}
		>
			{
				isAuthenticating
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
