import { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeContextValue, Theme, ThemeProviderProps } from '../types/types.js';
import { showErrorToast } from '../utils/toast.js';

// Initially undefined
// Every component connected to this context can read the theme
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
// Why 'createContext(undefined)' instead of 'createContext({})'
// Because if we accidentally forget ThemeProvider, we immediately get error -
// useTheme must be used inside ThemeProvider

const ThemeProvider = ({ children }: ThemeProviderProps) => {
    // Default theme is light
    const [theme, setTheme] = useState<Theme>('light');

    // Load previous theme
    // Runs only once when the application starts
    // We check whether the user previously selected a theme and stored it inside localStorage
    // If nothing exists, we simply keep the default light theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;

        // If user had already selected a theme before, just simply set the theme foor current state
        if(savedTheme) setTheme(savedTheme);
    }, []);

    // Whenever theme changes,
    // Save it so refreshing the browser doesn't reset user's choice
    // Then add the theme class to <html>
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    // Theme toggler (used in button)
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        // ThemeContext.Provider -> Make data (theme, toggleTheme) available to all child components below
        <ThemeContext.Provider
            // value -> the data we are sharing
            // Any component (children) inside it can access it with useContext(ThemeContext)
            // We pass both state + function so children can read and update theme
            value={{ theme, toggleTheme }}
        >
            {children} {/*All components here can use useContext(ThemeContext) now*/}
        </ThemeContext.Provider>
    );
};

// Small helper hook
// Instead of writing 'useContext(ThemeContext)' everywhere
// we will simply call useTheme()
const useTheme = () => {
    const context = useContext(ThemeContext);

    if(!context) {
        showErrorToast('Failed to change theme.');
        throw new Error('useTheme must be used inside ThemeProvider.');
    }

    return context;
};

export { ThemeProvider, useTheme };
