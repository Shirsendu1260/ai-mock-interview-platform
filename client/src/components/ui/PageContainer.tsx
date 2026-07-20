import type { PageContainerProps } from '../../types/types.js';
import { LAYOUT } from "../../constants/design.js";

const PageContainer = ({ children }: PageContainerProps) => {
	return (
		<div className={`
			bg-background ${LAYOUT.maxWidth} ${LAYOUT.paddingX} ${LAYOUT.paddingY} flex flex-col
			items-center justify-center
		`}>
			{children}
		</div>
	)
}

// Every page such as Login, Prices, Home etc. will share the same layout.

export default PageContainer
