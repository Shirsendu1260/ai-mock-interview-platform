import type { ButtonProps } from '../../types/types.js';
import { motion } from "motion/react"

const Button = ({
	children,
	className = '',
	...props
}: ButtonProps) => {
	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.982 }}
			transition={{
				type: "spring",
				stiffness: 400,
				damping: 20,
			}}
			className={`
				w-full
				rounded-xl
				bg-accent
				font-medium
				text-white
				h-12
				${className}
			`}

			// Makes access of all remaining button + motion attributes to the native HTML button 
			{...props}
		>
			{children}
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