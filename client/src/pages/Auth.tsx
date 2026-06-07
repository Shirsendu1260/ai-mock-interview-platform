import Card from "../components/ui/Card.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import GitHubSignInButton from "../components/auth/GitHubSignInButton.jsx";
import Logo from "../components/common/Logo.jsx";
import { signInWithGoogle, signInWithGitHub } from '../utils/firebase.js';

const Auth = () => {
	const handleGoogleSignIn = async () => {
		console.log("Google Sign In");

		try {
			const response = await signInWithGoogle();
			console.log(response);
		}
		catch(error) {
			console.error(error);
		}
	};

	const handleGitHubSignIn = async () => {
		console.log("GitHub Sign In");

		try {
			const response = await signInWithGitHub();
			console.log(response);
		}
		catch(error) {
			console.error(error);
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

					<GoogleSignInButton onClick={handleGoogleSignIn} />
					<GitHubSignInButton onClick={handleGitHubSignIn} />
				</div>
			</Card>
		</PageContainer>
	)
}

export default Auth