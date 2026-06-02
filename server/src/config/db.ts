import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if(!process.env.NEONDB_URI) {
	throw new Error('CRITICAL: NEONDB_URI is missing from your environment variables.');
}

// Create a stateless HTTP client for Neon. Neon treats queries like standard fetch requests,
// which means we never clog the database or crash from too many open connections.
const neonSql = neon(process.env.NEONDB_URI);

// Initialize the Drizzle runtime interface mapping to that client, which will be used to run SQL queries
const db = drizzle({ client: neonSql });
export { db };