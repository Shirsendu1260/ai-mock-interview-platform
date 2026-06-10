import Card from "../components/ui/Card.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import GitHubSignInButton from "../components/auth/GitHubSignInButton.jsx";
import Logo from "../components/common/Logo.jsx";
import { oAuthSignInHandler } from '../handlers/auth.handler.js';
import { tryCatchHandler } from "../utils/tryCatchHandler.js";

const Auth = () => {
	const handleGoogleSignIn = async () => {
		const provider = 'google';
		console.log("Google Sign In");
		await tryCatchHandler(async () => await oAuthSignInHandler(provider));
	};

	const handleGitHubSignIn = async () => {
		const provider = 'github';
		console.log("GitHub Sign In");
		await tryCatchHandler(async () => await oAuthSignInHandler(provider));
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