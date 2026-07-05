import type { PageContainerProps } from '../../types/types.js';
import { LAYOUT } from "../../constants/design.js";

const PageContainer = ({ children }: PageContainerProps) => {
	return (
		<div className={`py-7 bg-background ${LAYOUT.paddingX} flex flex-col items-center justify-center w-full`}>
			<div className={`w-full ${LAYOUT.maxWidth}`}>
				{children}
			</div>
		</div>
	);
}

// Every page such as Login, Prices, Home etc. will share the same layout.

export default PageContainer
