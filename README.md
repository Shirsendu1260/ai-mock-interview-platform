# AI Mock Interview Platform

A full-stack AI-powered mock interview platform built with React, Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, and Gemini AI.

The idea behind this project was to build something that feels close to a real interview workflow rather than just generating questions. Users can upload their resume, generate role-specific interviews, answer questions one by one, receive AI-generated feedback, track previous interviews, manage credits, and discover relevant job opportunities based on their resume.

---

## Features

- **AI Mock Interviews**: Resume-aware interview generation and answer evaluation using Google's Gemini API.
- **Authentication**: Firebase Google/GitHub OAuth with JWT access & refresh token authentication using HttpOnly cookies.
- **Interview Sessions**: Resume interrupted interviews, timer-based submission, question navigation, and prevention of multiple concurrent interview sessions.
- **Credit System**: Credit-based interview generation with Razorpay payment integration with webhook support and transaction history.
- **Resume Processing**: PDF resume parsing with AI-based role and technical skill extraction.
- **Job Search**: Personalized job recommendations using the Adzuna API with bookmarking support.
- **Dashboard**: Interview history, score analytics, profile management, payment history, and credit history.
- **Production Practices**: Joi validation, centralized error handling, Helmet, rate limiting, secure file uploads, reusable API response structure, and protected routes.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Firebase Admin SDK
- Google Gemini API
- Adzuna API
- Joi
- JWT Authentication
- Razorpay SDK
- Express Rate Limit
- Helmet

### Frontend

- React (Vite)
- TypeScript
- React Router
- Zustand
- Axios
- Tailwind CSS v4
- Motion
- Razorpay Checkout
- Recharts

### External Services

- Neon PostgreSQL
- Firebase Authentication
- Google AI Studio (Gemini)
- Razorpay
- Adzuna Jobs API

---

## Project Structure

```text
ai-mock-interview-platform/
│
├── client/              # React frontend
├── server/              # Express backend
├── scripts/
│   └── setup.sh         # First-time project setup
├── Makefile             # Common development commands
├── package.json         # npm workspace configuration
└── README.md
```

---

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+
- npm
- Git
- Neon PostgreSQL database
- Firebase project
- Google AI Studio API key
- Razorpay account
- Adzuna API credentials

## Getting Started

Clone the repository.

```bash
git clone https://github.com/Shirsendu1260/ai-mock-interview-platform.git
cd ai-mock-interview-platform
```

Make the setup script executable (only required once).

```bash
chmod +x scripts/setup.sh
```

Run the setup script.

```bash
./scripts/setup.sh
```

The setup script will automatically:

- Check that the required tools are installed (Node.js and npm).
- Install all project dependencies.
- Create `client/.env` and `server/.env` from their respective `.env.example` files (if they don't already exist).
- Check if OpenSSL is available for generating JWT secrets.
- Display the remaining setup steps.

After the script finishes:

1. Fill in the generated `.env` files with your own credentials.
2. Run the database migrations.
3. Start the development server.

```bash
make db-migrate
make dev
```

---

## Environment Variables

The project includes `.env.example` files for both the client and server.

During setup, `scripts/setup.sh` automatically creates the corresponding `.env` files if they don't already exist. These generated files contain placeholder values and must be updated with your own credentials before running the application.

### Client (`client/.env`)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_API_BASE_URL=

VITE_RAZORPAY_KEY_ID=
```

---

### Server (`server/.env`)

```env
PORT=8000
NEONDB_URI=
CORS_ORIGIN=
NODE_ENV=local

ACCESS_TOKEN_SECRET_KEY=
ACCESS_TOKEN_SECRET_KEY_EXPIRY=12h
REFRESH_TOKEN_SECRET_KEY=
REFRESH_TOKEN_SECRET_KEY_EXPIRY=10d

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

FIREBASE_SERVICE_ACCOUNT_JSON=

GEMINI_API_KEY=

ADZUNA_APP_ID=
ADZUNA_APP_KEY=
```

---

## Database

The project uses **Drizzle ORM** for schema management and database migrations.

### Generate a new migration

After making changes to your Drizzle schema, generate a migration file.

```bash
make db-generate
```

### Apply pending migrations

Run all pending migrations against your database.

```bash
make db-migrate
```

### Push schema directly to the database

Useful during development when you don't need migration files.

```bash
make db-push
```

### Open Drizzle Studio

Launch the visual database explorer.

```bash
make db-studio
```

---

## Running the Project

### Start the development server

Starts both the React frontend and Express backend with hot reload.

```bash
make dev
```

### Build for production

Builds both the frontend and backend.

```bash
make build
```

---

## Useful Commands

The project includes a **Makefile** that provides shortcuts for common development tasks.

| Command | Description |
|---------|-------------|
| `make help` | Show all available Makefile commands. |
| `make dev` | Start both frontend and backend. |
| `make build` | Build the entire project. |
| `make install` | Install all project dependencies. |
| `make server-dev` | Start only the backend server. |
| `make server-build` | Build only the backend. |
| `make server-start` | Start the production backend. |
| `make db-generate` | Generate Drizzle migration files. |
| `make db-migrate` | Apply pending database migrations. |
| `make db-push` | Push schema directly to the database (development only). |
| `make db-studio` | Open Drizzle Studio. |
| `make health` | Check whether the local backend is healthy. |
| `make health-prod RENDER_URL=<your-deployed-backend-url>` | Check the health of the deployed backend. |
| `make logs` | View formatted backend logs using Pino Pretty. |
| `make status` | Show Git status and recent commits. |
| `make clean-build` | Remove generated build files only. |
| `make clean` | Remove generated build files and all installed dependencies. |

---

## API Base URL

```
http://localhost:8000/api/v1
```

Protected endpoints require a valid JWT stored in an HttpOnly cookie.

---

## Response Format

### Success

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

### Error

```json
{
  "statusCode": 400,
  "message": "Validation failed.",
  "success": false,
  "errors": {
    "field": "Error message"
  }
}
```

---

## Developed By

**Shirsendu Mali**

Full Stack Developer

- LinkedIn: https://www.linkedin.com/in/shirsendu-mali/
- Email: shirsendu1260@gmail.com
