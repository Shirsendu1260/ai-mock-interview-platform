import Card from "../components/ui/Card.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import GitHubSignInButton from "../components/auth/GitHubSignInButton.jsx";
import Logo from "../components/common/Logo.jsx";
import { oAuthSignInHandler } from '../handlers/auth.handler.js';
import { useNavigate } from 'react-router-dom';
import type { OAuthProvider } from '../types/types.js';
import { ApiError } from '../utils/ApiError.js';
import { useAuthStore } from '../stores/auth.store.js';
import { showErrorToastWithToastId, showLoadingToast, showSuccessToastWithToastId } from "../utils/toast.js";
import { FirebaseError } from "firebase/app";

const Auth = () => {
	const navigate = useNavigate();
	const setIsAuthenticating = useAuthStore(state => state.setIsAuthenticating);
	const setOAuthProvider = useAuthStore(state => state.setOAuthProvider);

	const handleOAuthSignIn = async (provider: OAuthProvider) => {
		console.log("OAuth sign-in is in progress...");
        const toastId = showLoadingToast('Signing in...');

		try {
			setIsAuthenticating(true);
			setOAuthProvider(provider);
			await oAuthSignInHandler(provider);
			showSuccessToastWithToastId('Signed in successfully.', toastId);
			navigate('/dashboard'); // Navigate to /dashboard after successful sign-in
		}
		catch(error) {
			if(
				error instanceof FirebaseError &&
				error.code === 'auth/account-exists-with-different-credential'
			) {
				console.error(`Error ${error.code}: ${error.message}`);
				showErrorToastWithToastId(
					'This email in already registered using another sign-in method',
					toastId
				);
			}
			else if(
				error instanceof FirebaseError &&
				error.code === 'auth/popup-closed-by-user'
			) {
				console.error(`Error ${error.code}: ${error.message}`);
				showErrorToastWithToastId('Sign-in was cancelled', toastId);
			}
			else if(error instanceof ApiError) {
				console.error(`Error ${error.statusCode}: ${error.message}`);
				showErrorToastWithToastId(error.message, toastId);
			}
			else {
				console.error(error);
				showErrorToastWithToastId('Authentication failed.', toastId);
			}
		}
		finally {
			// Always reset state whether authentication succeeded or failed
			setIsAuthenticating(false);

			setOAuthProvider(null);
		}
	};

	return (
		<PageContainer>
			<Card>
				<div className="space-y-3">
					<header className="flex justify-center flex-col mb-7">
						<Logo size="lg" />
					</header>

					<section className="mb-7">
						<h2 className="mb-1 text-xl font-semibold">Welcome</h2>
						<p className="text-gray-500">Sign in to continue.</p>
					</section>

					<GoogleSignInButton onClick={() => handleOAuthSignIn('google')} />
					<GitHubSignInButton onClick={() => handleOAuthSignIn('github')} />
				</div>
			</Card>
		</PageContainer>
	)
}

export default Auth
