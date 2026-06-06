import type { PageContainerProps } from '../../types/types.js';

const PageContainer = ({ children }: PageContainerProps) => {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center sm:px-6 lg:px-8 px-4">
			{children}
		</div>
	)
}

// Every page such as Login, Prices, Home etc. will share the same layout.

export default PageContainer