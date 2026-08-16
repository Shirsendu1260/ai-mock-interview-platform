import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // Enables React support so Vitest can process JSX and React files correctly

    test: {
        // Uses a browser-like environment so APIs like window and document are available
        // Without jsdom, React component tests would not have a simulated browser environment
        environment: 'jsdom',

        // Runs this file before the tests start
        // It sets up custom matchers such as toBeInTheDocument()
        setupFiles: ['./src/tests/setup.ts'],

        // Where to find test files
        include: ['src/**/*.test.{ts,tsx}'],

        // Makes Vitest functions like describe, test, and expect available globally
        // This means they do not need to be imported in every test file
        globals: true,

        coverage: {
            // v8 is Node.js built-in coverage tool
            provider: 'v8',

            // Which files to measure coverage for
            include: ['src/**/*.{ts,tsx}'],

            // Which files to exclude from coverage
            exclude: [
                'src/**/*.test.{ts,tsx}',
                'src/main.tsx',
                'src/tests/**',
            ],

            // Coverage output formats
            reporter: ['text', 'html'],
            //  text -> Shown in terminal as table
            //  html -> Shown as detailed report
        },
    },
});
