import axios from 'axios';

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