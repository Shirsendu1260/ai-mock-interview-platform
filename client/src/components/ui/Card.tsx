import type { CardProps } from '../../types/types.js';
import { motion } from "motion/react"


const Card = ({ children, className }: CardProps) => {
	return (
		<motion.div 
			initial={{ opacity: 0, y: -25 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1.02 }}
			className={`
				w-full
				max-w-lg
				rounded-3xl
				border
				border-border
				bg-white
				p-8
				shadow-sm
				${className}
			`}
		>
			{children}
		</motion.div>
	)
}

export default Card