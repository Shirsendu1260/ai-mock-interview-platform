import type { PropsWithChildren, InputHTMLAttributes, ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";
import type { IconType } from 'react-icons';
import type { DIFFICULTIES, NO_OF_QUESTIONS } from "../constants/interview.js";

type CardProps = PropsWithChildren<{
	className?: string;
}>;

type PageContainerProps = PropsWithChildren;

// type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;
/*
ButtonHTMLAttributes<HTMLButtonElement>
-> Includes all native HTML button props
(type, disabled, onClick, autoFocus, aria-*, etc.).

PropsWithChildren<T>
-> Adds React's children prop to any type (here, <T>).

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
	id: string;
	fullName: string;
	email: string;
	avatarUrl: string | null;
	credit: number;
	createdAt: string | Date;
	updatedAt: string | Date;
};

type OAuthProvider = 'google' | 'github';

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
	[key: string]: string; // key can be any string // value must be a string
};


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

type UserAvatarSizeProps = {
	size?: number
}

// DIFFICULTIES is declared with 'as const', so TypeScript treats
// each array element as a literal type ('easy', 'medium', 'hard')
// instead of just a generic string. [number] means - give the type
// of any element inside this array. So Difficulty becomes:
// 'easy' | 'medium' | 'hard' automatically.
type Difficulty = typeof DIFFICULTIES[number];
type QuestionsCount = typeof NO_OF_QUESTIONS[number];

type RoleSelectorProps = {
	role: string;
	setRole: React.Dispatch<React.SetStateAction<string>>;
	error?: string;
	setErrors: React.Dispatch<React.SetStateAction<IErrorMessage>>;
};

type DifficultySelectorProps = {
    difficulty: Difficulty | '';
    setDifficulty: React.Dispatch<React.SetStateAction<Difficulty | ''>>;
    error?: string;
	setErrors: React.Dispatch<React.SetStateAction<IErrorMessage>>;
};

type NoOfQtnsSelectorProps = {
    qtnsCount: QuestionsCount | 0;
    setQtnsCount: React.Dispatch<React.SetStateAction<QuestionsCount | 0>>;
    error?: string;
	setErrors: React.Dispatch<React.SetStateAction<IErrorMessage>>;
};

type ResumeUploaderProps = {
	resumePdfFile: File | null;
	setResumePdfFile: React.Dispatch<React.SetStateAction<File | null>>;
	error?: string;
	setErrors: React.Dispatch<React.SetStateAction<IErrorMessage>>;
};

type CreditCostCardProps = {
	interviewCost: number;
};

interface CreateInterviewResponse {
    id: string;
}

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
	NavbarLinksProps,
	UserAvatarSizeProps,
	Difficulty,
	QuestionsCount,
	RoleSelectorProps,
	DifficultySelectorProps,
	NoOfQtnsSelectorProps,
	ResumeUploaderProps,
	CreditCostCardProps,
	CreateInterviewResponse
};
