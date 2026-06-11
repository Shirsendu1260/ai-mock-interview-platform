import type { SectionHeadingProps } from '../../types/types.js';

const SectionHeading = ({
	children,
	description
}: SectionHeadingProps) => {
	return (
		<div className='mx-auto max-w-2xl text-center'>
			<h2 className='text-3xl font-bold tracking-tight text-dark md:text-4xl'>
				{children}
			</h2>

			{
				description && (
					<p className='mt-4 text-base leading-7 text-muted'>
						{description}
					</p>
				)
			}
		</div>
	);
};

export default SectionHeading;