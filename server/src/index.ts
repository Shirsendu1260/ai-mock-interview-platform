import "dotenv/config";
import { app } from './app.js';

try {
	// Start the Express server on the specified port
    const PORT = Number(process.env.PORT ?? '8000');
    const server = app.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}`);
    });

    // Listen for any errors (Node system errors or standard JS errors) emitted by server
    server.on('error', (error: NodeJS.ErrnoException | Error) => {
        console.error('SERVER ERROR:', error);
        process.exit(1);
    });
}
catch(error: unknown) {
	if(error instanceof Error) {
        console.error("NEONDB CONNECTION FAILED:", error.message);
    }
    else {
        console.error("NEONDB CONNECTION FAILED:", error);
    }
}