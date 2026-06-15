import type { InputProps } from '../../types/types.js';

// Shared input component used thrughout the project
// Contains - labels, validation errors, native HTML input props

const Input = ({ id, className = '', label, error, ...props }: InputProps) => {
	return (
		<div className='w-full'>
			{label && (
				<label htmlFor={id} className='mb-2 block text-sm font-medium text-dark'>{label}</label>
			)}

			<input
				id={id}
				className={`
					h-12 w-full rounded-xl border border-border bg-white
					px-4 text-dark outline-none transition focus:border-accent ${className}
				`}

				// Allow other input props automatically
				{...props}
			/>

			{error && (
				<p className='mt-1 text-sm text-red-500'>{error}</p>
			)}
		</div>
	)
}

export default Input
