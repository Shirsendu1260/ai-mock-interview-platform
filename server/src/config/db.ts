import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

if (!process.env.NEONDB_URI) {
	throw new Error('CRITICAL: NEONDB_URI is missing from your environment variables.');
}

// Enable WebSocket support for Node.js
// Neon uses WebSockets to support PostgreSQL transactions
neonConfig.webSocketConstructor = ws;

// Create a PostgreSQL connection pool
// The pool efficiently reuses database connections instead of
// opening a brand new connection for every query
const pool = new Pool({
	connectionString: process.env.NEONDB_URI
});

// Create Drizzle database instance
const db = drizzle({ client: pool });

export { db };
