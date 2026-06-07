import Card from "../components/ui/Card.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import MicrosoftSignInButton from "../components/auth/MicrosoftSignInButton.jsx";
import Logo from "../components/common/Logo.jsx";

const Auth = () => {
	const handleGoogleSignIn = () => {
		console.log("Google Sign In");
	};

	const handleMicrosoftSignIn = () => {
		console.log("Microsoft Sign In");
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
					<MicrosoftSignInButton onClick={handleMicrosoftSignIn} />
				</div>
			</Card>
		</PageContainer>
	)
}

export default Auth