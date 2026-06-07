import type { PageContainerProps } from '../../types/types.js';
import { LAYOUT } from '../../constants/layout.js';

const PageContainer = ({ children }: PageContainerProps) => {
	return (
		<div className={`min-h-screen bg-background px-4 sm:px-6 lg:px-8 flex items-center justify-center ${LAYOUT.pageMaxWidth}`}>
			{children}
		</div>
	)
}

// Every page such as Login, Prices, Home etc. will share the same layout.

export default PageContainer