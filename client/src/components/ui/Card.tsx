import type { CardProps } from '../../types/types.js';
import { motion } from 'motion/react';

const Card = ({
	children,
	className = ''
}: CardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.4 }}
			className={`
				rounded-3xl border border-border bg-white p-8
				shadow-sm transition-all duration-300 hover:-translate-y-1
				hover:shadow-lg
				${className}
			`}
		>
			{children}
		</motion.div>
	);
};

export default Card;
