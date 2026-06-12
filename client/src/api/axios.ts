import axios from 'axios';
import { useAuthStore } from '../stores/auth.store.js';
import { ApiResponse } from '../utils/ApiResponse.js'
import type { AxiosResponse } from 'axios';

// Single HTTP client used in this project
export const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,

	// Tells server that client is sending JSON, so backend can safely parse req.body
	headers: {
		'Content-Type': 'application/json'
	},

	// Used when backend sets cookies
	// Backend sends: res.cookie('accessToken', token, options)
	// Browsers normally ignores cookies coming from another origin (Frontend: localhost:5173, Backend: localhost:8000)
	// Without this option, cookie is not sent
	// With this option, browser sends and receives cookies
	// Required when using cookie-based auth
	withCredentials: true
});

// What is an Axios interceptor?
// We know how in Express we have middleware: code that runs before our controller on every request.
// Request -> verifyJWT middleware -> controller
// Axios interceptor is the exact same idea, but on the frontend. It runs automatically on every request or every response, before our component code sees it.
// There are two types:
// Request interceptor —> runs before a request is sent. Example: "attach an auth header to every request automatically."
// Response interceptor —> runs after a response comes back. Example: "if the response is a 401 error, do something before giving the error to the component."
// That second one is exactly what we need.

// What we want to happen
// Right now without an interceptor, here's what happens when access token expires:
// Component calls getAuthUser()
//   -> 401 comes back
//   -> component gets an error
//   -> user gets logged out
//   -> user needs to sign in via google/github again to get an access token
// What we want:
// Component calls getAuthUser()
//   -> 401 comes back
//   -> axios interceptor silently calls /refresh-token
//   -> new access token is set in cookie
//   -> interceptor retries the original request automatically with the new token
//   -> component gets the data it wanted, it never knew anything failed
// The component never has to handle token refresh. It just works.

// The structure:
// api.interceptors.response.use(
//   (response) => response,       // success: just pass it, do nothing
//   async (error) => {            // failure: this is where we handle 401
//     // our retry logic here
//   }
// );

// One problem: infinite loop:
// If the refresh call itself returns a 401, the interceptor will catch that 401 too, and try to refresh again, which returns 401, which triggers refresh again... forever.
// We prevent this with a simple flag on the original failed request config:
// if (originalRequest._retry) {
//   // already tried once, do not try again
//   // log the user out
// }
// originalRequest._retry = true; // mark it so we don't loop

const refreshAccessToken = (): Promise<AxiosResponse<ApiResponse<{ 
	accessToken: string, refreshToken: string 
}>>> => {
    return api.post('/user/refresh-token');
};

// our response interceptor
api.interceptors.response.use(
	// Success: do nothing, just pass the response as it was
	(response) => response,

	// Failure: runs when API call returns an error
	async (error) => {
		// error.config: config of the original request that failed
		// Example: if getAuthUser() failed, error.config has all its details
        // so we can retry it later
		const originalRequest = error.config;

		// Only attempt for a refresh, if:
		// 1. The error that happened is 401 (unauthorized, token expired or invalid token)
		// 2. We have not already retried the request yet (prevents infinite loop)
		if(error.response?.status === 401 && !originalRequest._retry) {
			// Mark this original request as already retried
			originalRequest._retry = true;

			try {
				// Ask backend for new access & refresh tokens using the refresh token in cookie
                await refreshAccessToken();

                // After successfully getting new access and refresh tokens in secure cookie 
                // in browser, retry the original failed request
                return api(originalRequest);
			}
			catch(refreshTokenError) {
				// If error occurs during refresh (e.g, token expired or invalid) in the 'try' block
				// Logout the user, clear Zustand state
				useAuthStore.getState().clearUser();

				// api.get() returns a Promise, 'await' waits for it to finish. It can finish in 
				// two ways: Resolved (success, we get the data), Rejected (failure, we get an error)
				// We cannot throw error here as Axios expects a Promise in return
				// So we are returning a failed Promise with this error inside it
				// Our component calls api.get(...)
				//      V     
				// response comes back
				//      V
				// Interceptor starts and tries refresh token
				//      V  
				// Success? -> retry original request -> success & return response   -> component gets data
				// 401 + refresh failed?            
				//            -> Promise.reject()     -> component gets error
				// Other error (500, 404)?          
				//            -> Promise.reject()     -> component gets error
				return Promise.reject(refreshTokenError);
			}
		}

		// For all other errors (400, 500 etc.), just pass them normally
        return Promise.reject(error);
	}
);