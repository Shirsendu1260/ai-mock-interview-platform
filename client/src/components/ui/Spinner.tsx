import { motion } from "motion/react";
import type { SpinnerProps } from "../../types/types.js";

const Spinner = ({ size = 'md' }: SpinnerProps) => {
	const sizeObj = {
		sm: "h-4 w-4",
		md: "h-6 w-6",
		lg: "h-9 w-9",
	};

	const sizeClass = sizeObj[size];

	return (
		<motion.div
			animate={{ rotate: 360 }}
			transition={{
				repeat: Infinity,
				duration: 1,
				ease: 'linear'
			}}
			className={`rounded-full border-3 border-border border-t-accent ${sizeClass}`}
		/>
	)
}

export default Spinner