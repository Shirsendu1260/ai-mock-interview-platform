import "dotenv/config";
import { app } from './app.js';
import { logger } from "./config/logger.js";
import { validateEnv } from './config/validateEnv.js';

// validateEnv() must run before any other import that reads process.env
// fails fast if env variables are missing
validateEnv();

try {
	// Start the Express server on the specified port
    const PORT = Number(process.env.PORT ?? '8000');
    const server = app.listen(PORT, () => {
        logger.info({ port: PORT }, `Server is listening on PORT ${PORT}`)
    });

    // Graceful shutdown: when the process receives SIGTERM (e.g. from Render
    // during a deploy or scale-down), stop accepting new connections and wait
    // for existing ones to finish before exiting
    // Without this, the server exits abruptly and in-flight requests are dropped
    const shutdown = (signal: string) => {
        logger.info({ signal }, `Received shutdown signal. Starting graceful shutdown.`);

        server.close(() => {
            logger.info('HTTP server closed. Process exiting.');
            process.exit(0); // 0 -> successful shutdown, exit normally
        });

        // Force exit after 10s if connections don't close in time
        setTimeout(() => {
            logger.error('Graceful shutdown timed out. Forcing exit.');
            process.exit(1); // 1 -> abnormal termination, exit with an error
        }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT',  () => shutdown('SIGINT'));

    server.on('error', (error: NodeJS.ErrnoException | Error) => {
        logger.error({ err: error }, 'SERVER ERROR');
        process.exit(1);
    });
}
catch(error: unknown) {
    // This catch block handles synchronous errors thrown during startup
    if(error instanceof Error) {
        logger.fatal({ error }, `STARTUP FAILED: ${error.message}`);
    }
    else {
        logger.fatal({ error }, `STARTUP FAILED: ${error}`);
    }

    process.exit(1);
}

// | Signal | Number | Meaning
// | `SIGTERM` | 15 | Graceful shutdown request
// | `SIGINT` | 2 | Interrupt (Ctrl+C)
// | `SIGKILL` | 9 | Force kill immediately
// | `SIGHUP` | 1 | Terminal closed / reload config
