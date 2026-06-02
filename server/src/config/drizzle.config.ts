// The Drizzle Kit CLI tool explicitly looks for drizzle.config.ts at the very root of our project 
// by default. To make it work there, we are forced to manually type out the path flag for every 
// single script in our package.json

import { defineConfig } from 'drizzle-kit';

if(!process.env.NEONDB_URI) {
	throw new Error('CRITICAL: NEONDB_URI is missing from your environment variables.');
}

// Tells Drizzle CLI on where to look for our TypeScript schema definitions, where to output raw SQL 
// migrations, and how to connect directly to Neon to push migrations.
export default defineConfig({
	out: './src/db/migrations',
	schema: './src/db/schema/index.ts',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.NEONDB_URI
	}
});