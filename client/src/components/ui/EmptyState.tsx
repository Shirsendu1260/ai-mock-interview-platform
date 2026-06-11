import { motion } from 'motion/react';
import { PiBriefcaseFill } from 'react-icons/pi';
import type { EmptyStateProps } from '../../types/types.js';

const EmptyState = ({
	title,
	description,
	icon,
	action
}: EmptyStateProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='flex flex-col items-center text-center py-12'
		>
			<div className='mb-4 rounded-2xl bg-primary/10 p-4 text-primary'>
				{icon ?? (
					<PiBriefcaseFill size={40} />
				)}
			</div>

			<h3 className='text-xl font-semibold text-dark'>{title}</h3>
			<p className='mt-2 max-w-md text-muted'>{description}</p>
			
			{action && (
				<div className='mt-6'>{action}</div>
			)}
		</motion.div>
	)
}

export default EmptyState