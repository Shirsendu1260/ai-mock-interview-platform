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
- **Production Practices**: Joi validation, centralized error handling, structured logging with Pino, Helmet, rate limiting, secure file uploads, reusable API response structure, and protected routes.
- **Containerization**: Multi-stage Docker builds for both frontend and backend, with Docker Compose for local orchestration and Nginx as a reverse proxy for the React frontend.
- **CI/CD**: GitHub Actions pipeline covering TypeScript type checks, Docker image builds, Docker Hub pushes, and automated deployment hooks to Render and Vercel.
- **Testing**: Unit and integration tests using Vitest and Supertest on the backend, and React Testing Library on the frontend.

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
- Pino (structured logging)
- Vitest
- Supertest

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
- React Testing Library

### Infrastructure & DevOps

- Docker & Docker Compose
- Nginx
- GitHub Actions (CI/CD)
- Docker Hub

### External Services

- Neon PostgreSQL
- Firebase Authentication
- Google AI Studio (Gemini)
- Razorpay
- Adzuna Jobs API
- Render (backend hosting)
- Vercel (frontend hosting)

---

## Project Structure

```text
ai-mock-interview-platform/
│
├── .github/
│   └── workflows/
│       └── cicd.yml         # GitHub Actions CI/CD pipeline
├── client/                  # React frontend
│   ├── Dockerfile           # Multi-stage frontend Docker build
│   ├── nginx.conf           # Nginx config for serving React SPA
│   └── src/
├── server/                  # Express backend
│   ├── Dockerfile           # Multi-stage backend Docker build
│   └── src/
│       ├── config/          # DB, Firebase, Razorpay, env validation, vitest config
│       ├── controllers/     # Route handlers
│       ├── db/              # Drizzle schema and migrations
│       ├── middlewares/     # Auth, rate limiting, file upload
│       ├── routes/          # Express routers
│       ├── services/        # AI, PDF, job search logic
│       ├── tests/
│       │   ├── unit/        # Unit tests
│       │   └── integration/ # Integration tests
│       ├── types/           # TypeScript types
│       └── utils/           # ApiResponse, ApiError, tokens etc.
├── scripts/
│   └── setup.sh             # First-time project setup
├── docker-compose.yml       # Local multi-container setup
├── Makefile                 # Common development commands
├── package.json             # npm workspace configuration
└── README.md
```

---

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+
- npm
- Git
- Docker & Docker Compose (for containerized local development)
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

The project includes `.env.example` files for both the client and server. A root-level `.env.example` is also provided for Docker Compose.

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

> Generate secure JWT secrets with: `openssl rand -hex 32`

---

## Database

The project uses **Drizzle ORM** for schema management and database migrations.

```bash
make db-generate   # Generate migration files after schema changes
make db-migrate    # Apply pending migrations
make db-push       # Push schema directly (development only)
make db-studio     # Open visual database explorer
```

---

## Running the Project

### Standard development

```bash
make dev           # Start frontend + backend with hot reload
make build         # Build both for production
```

### With Docker Compose

Runs frontend (Nginx + React) and backend (Node.js) as containers. Requires a root `.env` file, copy from `.env.example`.

```bash
docker compose up --build     # Build images and start all containers
docker compose up             # Start existing containers
docker compose down           # Stop and remove containers
docker compose logs -f        # Stream live logs
docker compose logs -f server # Stream backend logs only
```

### Running tests

```bash
cd server
npm test                # Run all tests once
npm run test:watch      # Re-run tests on file save (development)
npm run test:coverage   # Run tests and generate coverage report
```

---

## CI/CD Pipeline

Every push to `main` triggers the GitHub Actions pipeline:

1. **TypeScript type-check**: backend and frontend.
2. **Docker image build**: backend and frontend (verifies Dockerfiles and compilation).
3. **Docker Hub push**: backend image uploaded.
4. **Render deploy hook**: backend redeployment triggered.
5. **Vercel deploy hook**: frontend redeployment triggered (Vercel auto-deploy is disabled; deployment only happens after CI passes).

Pull requests trigger steps 1–2 only. Deployment never happens on unmerged code.

---

## Useful Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available Makefile commands |
| `make dev` | Start both frontend and backend |
| `make build` | Build the entire project |
| `make install` | Install all project dependencies |
| `make server-dev` | Start only the backend server |
| `make server-build` | Build only the backend |
| `make server-start` | Start the production backend |
| `make db-generate` | Generate Drizzle migration files |
| `make db-migrate` | Apply pending database migrations |
| `make db-push` | Push schema directly (development only) |
| `make db-studio` | Open Drizzle Studio |
| `make health` | Check local backend health |
| `make health-prod RENDER_URL=<url>` | Check deployed backend health |
| `make logs` | View formatted backend logs via Pino Pretty |
| `make status` | Show Git status and recent commits |
| `make clean-build` | Remove build files only |
| `make clean` | Remove build files and all dependencies |

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
  "data": { ... },
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