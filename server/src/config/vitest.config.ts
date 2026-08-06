import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Tell Vitest to treat test environment as Node.js
        // (not browser), because we're testing a backend server
        environment: 'node',

        // Where to find test files
        // **/*.test.ts means: any file ending in .test.ts
        // anywhere inside the src/ folder
        include: ['src/**/*.test.ts'],

        // Files to run before each test file
        setupFiles: [],

        // Show individual test results (not just summary)
        reporters: ['verbose'],

        // Code coverage configuration
        coverage: {
            // v8 is Node.js built-in coverage tool
            provider: 'v8',

            // Which files to measure coverage for
            include: ['src/**/*.ts'],

            // Which files to exclude from coverage
            exclude: [
                'src/**/*.test.ts', // test files themselves
                'src/index.ts', // server entry point
                'src/db/migrations/**', // database migrations
                'src/db/schema/**', // schema definitions
                'src/types/**', // type definitions only
            ],

            // Coverage output formats
            reporter: ['text', 'html'],
            //  text -> Shown in terminal as table
            //  html -> Shown as detailed report
        },
    },
});
