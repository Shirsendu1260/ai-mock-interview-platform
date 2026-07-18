import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "motion/react";
import { useTheme } from "../../context/ThemeContext";

const ThemeToggle = () => {
    // Read current theme and the function that switches it
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.92 }}
            className="
                flex h-10 w-10 items-center justify-center rounded-full border border-border
                bg-background text-dark shadow-sm transition-colors hover:bg-primary hover:text-white
            "
        >
            {
                theme === "light" ? <FaMoon size={16} /> : <FaSun size={16} />
            }
        </motion.button>
    );
};

export default ThemeToggle;
