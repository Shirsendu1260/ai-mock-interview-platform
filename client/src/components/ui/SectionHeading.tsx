import type { SectionHeadingProps } from '../../types/types.js';

const SectionHeading = ({ children, description }: SectionHeadingProps) => {
	return (
		<div>
			<h2 className='text-2xl font-bold text-dark'>{children}</h2>
			{description && (
				<p className='mt-2 text-sm text-muted'>{description}</p>
			)}
		</div>
	)
}

export default SectionHeading