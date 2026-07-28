import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

// Enable WebSocket support for Node.js
// Neon uses WebSockets to support PostgreSQL transactions
neonConfig.webSocketConstructor = ws;

// Create a PostgreSQL connection pool
// The pool efficiently reuses database connections instead of
// opening a brand new connection for every query
const pool = new Pool({
	connectionString: process.env.NEONDB_URI,
	max: 6, // max. no. of db conections

	// Close idle connections after 30s
	idleTimeoutMillis: 30000,

	// fail if connection cannot be acquired within 4s
	connectionTimeoutMillis: 4000
});

// Create Drizzle database instance
const db = drizzle({ client: pool });

export { db };
