import { motion } from "motion/react";
import type { SpinnerProps } from "../../types/types.js";

const Spinner = ({ size = 'md' }: SpinnerProps) => {
	const sizeObj = {
		sm: "h-6 w-6",
		md: "h-9 w-9",
		lg: "h-12 w-12",
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
			className={`rounded-full border-4 border-border border-t-accent ${sizeClass}`}
		/>
	)
}

export default Spinner
