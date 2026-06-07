import type { CardProps } from '../../types/types.js';

const Card = ({ children, className }: CardProps) => {
	return (
		<div className={`w-full max-w-lg rounded-3xl border border-border bg-white p-8 shadow-sm ${className}`}>
			{children}
		</div>
	)
}

export default Card