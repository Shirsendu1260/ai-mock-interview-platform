import Card from "../components/ui/Card.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import GoogleSignInButton from "../components/auth/GoogleSignInButton.jsx";
import Logo from "../components/common/Logo.jsx";

const Auth = () => {
	const handleGoogleSignIn = () => {
		console.log("Google Sign In");
	};

	return (
		<PageContainer>
			<Card>
				<div className="space-y-8">
					<header className="text-center">
						<Logo size="lg" />
						<p className="mt-2 text-gray-500">
							Practice technical interviews
							with AI.
						</p>
					</header>

					<section>
						<h2 className="mb-2 text-xl font-semibold">
							Welcome
						</h2>

						<p className="text-gray-500">
							Sign in to continue.
						</p>
					</section>

					<GoogleSignInButton onClick={handleGoogleSignIn} />
				</div>
			</Card>
		</PageContainer>
	)
}

export default Auth