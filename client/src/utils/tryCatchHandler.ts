import { ApiError } from './ApiError.js';

// Generic async wrapper to avoid writing try-catch blocks everywhere
// <T> means this function can work with any return type: string, number, objects etc.
// So async <T>(...) means: An async function that works with any type T.
// It accepts an async callback named 'handler' (this callback returns Promise<T>) and returns either:
// 1. the value (T) returned by the callback by resolving promise (Promise<T>)
// 2. 'undefined' if an error occurs
const tryCatchHandler = async <T>(handler: () => Promise<T>): Promise<T | undefined> => {
	try {
		// Run the async callback and wait for it to finish
		// Whatever the value it returns is returned from 'tryCatchHandler' as well
		return await handler();
	}
	catch(error) {
		if(error instanceof ApiError) console.error(`Error ${error.statusCode}: ${error.message}`);
		else console.error(error);

		// Since nothing is returned at this point
		// TS knows the function may return 'undefined'
	}
};

export { tryCatchHandler };