import type { PropsWithChildren, InputHTMLAttributes, ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";
import type { IconType } from 'react-icons';

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

type ButtonVariant = "primary" | "secondary" | "ghost"; 
// primary: main actions, secondary: supporting actions, ghost: low priority actions

type ButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
	children: ReactNode,
	isLoading?: boolean,
	variant?: ButtonVariant
};
/*
HTMLMotionProps<"button"> combines:
1. Native HTML button attributes: type, disabled, onClick, aria-* attributes, etc.
2. Motion-specific props: whileHover, whileTap, animate, initial, exit, drag, variants, etc.
3. isLoading, variant
Our Button component renders <motion.button>, not a native <button>.
Therefore we use HTMLMotionProps instead of ButtonHTMLAttributes
so that both Motion and native button props are available.
*/
/*
HTMLMotionProps<"button"> allows children to be: ReactNode | MotionValue<number> | MotionValue<string>
But React expects: ReactNode, inside JSX.
That's why TypeScript complains at: {children}
with: Type 'MotionValueNumber' is not assignable to type 'ReactNode'
Fix with 'Omit':
Think of it like overriding a TypeScript interface.
Motion says:
children: ReactNode | MotionValue<number> | MotionValue<string>;
We don't want that.
Our Button should only accept:
children: ReactNode;
because:
<Button>Login</Button>
or
<Button><Spinner /></Button>
are the only valid use cases.
So we omit the children type provided by motion and add our ReactNode type children
*/

type SectionHeadingProps = PropsWithChildren<{
	description?: string;
}>;

type ThirdPartySignInButtonProps = {
	onClick?: () => void
};

type LogoProps = {
	size?: "sm" | "md" | "lg";
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string,
	error?: string,
	helperText?: string; // Something like 'Password must contain at least 8 characters'
};

type SpinnerProps = {
	size?: "sm" | "md" | "lg";
};

type EmptyStateProps = {
	title: string,
	description: string,
	icon?: ReactNode,
	action?: ReactNode
};

interface User {
	id: number;
	fullName: string;
	email: string;
	avatarUrl: string | null;
	credit: number;
};

// Global authentication state interface for Zustand
interface AuthState {
	user: User | null;
	oAuthProvider: OAuthProvider | null;
	isAuthenticated: boolean;

	// App loading
	isLoading: boolean;

	// OAuth login loading, will be set to true when login is in progress
	isAuthenticating: boolean;

	setUser: (user: User | null) => void;
	setOAuthProvider: (provider: OAuthProvider | null) => void;
	setIsLoading: (flag: boolean) => void;
	setIsAuthenticating: (flag: boolean) => void;
	clearUser: () => void;
};

interface IErrorMessage {
	[key: string]: string; // key can be ANY string // value must be a string
};

type OAuthProvider = 'google' | 'github';

type SidebarLinkProps = {
	to: string; // Sidebar url
	icon: IconType;
	label: string;
};

type StatsCardProps = {
	title: string;
	value: string | number;
};

type NavbarLinksProps = {
	isMobile?: boolean;
};

export type {
	CardProps,
	PageContainerProps,
	ButtonProps,
	SectionHeadingProps,
	ThirdPartySignInButtonProps,
	LogoProps,
	InputProps,
	SpinnerProps,
	EmptyStateProps,
	User,
	AuthState,
	IErrorMessage,
	OAuthProvider,
	SidebarLinkProps,
	StatsCardProps,
	NavbarLinksProps
};