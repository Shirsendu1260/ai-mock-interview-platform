import type { PropsWithChildren } from "react";
import type { HTMLMotionProps } from "motion/react";

type CardProps = PropsWithChildren<{
	className?: string;
}>;

type PageContainerProps = PropsWithChildren;

// type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;
/*
ButtonHTMLAttributes<HTMLButtonElement>
→ Includes all native HTML button props
(type, disabled, onClick, autoFocus, aria-*, etc.).

PropsWithChildren<T>
→ Adds React's children prop to any type (here, <T>).

So:
PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
means: All standard button attributes + children

Conceptually:
{
	children?: ReactNode;
	type?: 'button' | 'submit' | 'reset';
	disabled?: boolean;
	onClick?: MouseEventHandler;
	className?: string;
	// many more button props...
}

React already provides these types, so we don't need
to define every button prop manually.
*/

type ButtonProps = HTMLMotionProps<"button">;
/*
HTMLMotionProps<"button"> combines:

1. Native HTML button attributes: type, disabled, onClick, aria-* attributes, etc.
2. Motion-specific props: whileHover, whileTap, animate, initial, exit, drag, variants, etc.

Our Button component renders <motion.button>, not a native <button>.
Therefore we use HTMLMotionProps instead of ButtonHTMLAttributes
so that both Motion and native button props are available.
*/

type GoogleSignInButtonProps = {
	onClick?: () => void
};

type LogoProps = {
	size?: "sm" | "md" | "lg";
};

export type {
	CardProps,
	PageContainerProps,
	ButtonProps,
	GoogleSignInButtonProps,
	LogoProps
};