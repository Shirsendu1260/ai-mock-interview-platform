import type { ButtonProps } from '../../types/types.js';
import { motion } from "motion/react"
import Spinner from "./Spinner.jsx";

const Button = ({
	children,
	className = '',
	isLoading = false,
	variant = 'primary',
	disabled,
	...props
}: ButtonProps) => {
	const variantClasses = {
		primary: "bg-accent text-white",
		secondary: "bg-primary text-white",
		ghost: "border border-border bg-white text-dark",
	};

	const variantClass = variantClasses[variant] ?? variantClasses.primary;

	return (
		<motion.button
			whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined }
			whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined }
			transition={{
				type: "spring",
				stiffness: 400,
				damping: 20,
			}}

			// Prevents user interaction while this button is explicitly disabled or loading state is active
			// Avoids duplicated API requests
			disabled={ disabled || isLoading }

			className={`
				w-full
				h-12
				rounded-xl
				font-medium
				transition
				flex
				items-center
				justify-center
				gap-2
				disabled:cursor-not-allowed
				disabled:opacity-60
				${variantClass}
				${className}
			`}

			// Makes access of all remaining button + motion attributes to the native HTML button 
			{...props}
		>
			{children}
			{isLoading && (<Spinner size="sm" />)}
		</motion.button>
	)
}

export default Button



/*
React passes all component attributes as a single props object.

Example:

<Button
	className="bg-red-500"
	onClick={handleClick}
	type="submit"
>
	Login
</Button>

becomes:

{
	children: "Login",
	className: "bg-red-500",
	onClick: handleClick,
	type: "submit"
}

We destructure the props object to extract the values we need.
Everything else is collected into ...props.
*/

/*
...props is the rest operator.

Example:

{
	children: "Login",
	className: "bg-red",
	onClick: handleClick,
	type: "submit",
	disabled: true
}

becomes:

children = "Login"
className = "bg-red"
props = {
	onClick: handleClick,
	type: "submit",
	disabled: true
}

This lets us forward all remaining button attributes
(onClick, type, disabled, aria-*, autoFocus, etc.)
to the native HTML button without passing them one by one.

<button {...props} />

Result: our custom Button behaves like a normal HTML
<button> while keeping the project's default styling.
*/