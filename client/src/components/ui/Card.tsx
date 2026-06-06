import type { CardProps } from '../../types/types.js';

const Card = ({ children, className }: CardProps) => {
	return (
		<div className={`w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ${className}`}>
			{children}
		</div>
	)
}

export default Card