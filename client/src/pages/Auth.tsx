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

const Auth = () => {
	const navigate = useNavigate();
	const setIsAuthenticating = useAuthStore(state => state.setIsAuthenticating);

	const handleOAuthSignIn = async (provider: OAuthProvider) => {
		console.log("OAuth sign-in is in progress...");

		try {
			setIsAuthenticating(true);
			await oAuthSignInHandler(provider);
			navigate('/dashboard'); // Navigate to /dashboard after successful sign-in
		}
		catch(error) {
			if(error instanceof ApiError) {
				console.error(`Error ${error.statusCode}: ${error.message}`);
			}
			else {
				console.error(error);
			}
		}
		finally {
			// Always reset state whether authentication succeeded or failed
			setIsAuthenticating(false);
		}
	};

	return (
		<PageContainer>
			<Card>
				<div className="space-y-3">
					<header className="flex justify-center flex-col mb-7">
						<Logo size="lg" />
						<p className="mt-3 text-gray-500 text-center">
							Practice technical interviews with AI.
						</p>
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