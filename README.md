# AI Mock Interview Platform

A full-stack AI-powered mock interview platform built with React, Node.js, Express, TypeScript, PostgreSQL, and Drizzle ORM.

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
- **Production Practices** – Joi validation, centralized error handling, Helmet, rate limiting, secure file uploads, reusable API response structure, and protected routes.

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
- Joi
- JWT Authentication
- Razorpay
- Express Rate Limit
- Helmet

### Frontend

- React
- TypeScript
- React Router
- Zustand
- Axios
- Tailwind CSS v4
- Motion
- Recharts

### External Services

- Neon PostgreSQL
- Firebase Authentication
- Google AI Studio (Gemini)
- Razorpay
- Adzuna Jobs API

---

## Project Structure

```
ai-mock-interview-platform/
│
├── client/             # React frontend
├── server/             # Express backend
├── package.json        # Workspace configuration
└── README.md
```

---

## Getting Started

### Requirements

- Node.js 20+
- Neon PostgreSQL database
- Firebase project
- Google AI Studio API key
- Razorpay account
- Adzuna API credentials

Clone the repository.

```bash
git clone https://github.com/Shirsendu1260/ai-mock-interview-platform.git

cd ai-mock-interview-platform
```

Install dependencies for both workspaces.

```bash
npm install
```

---

## Environment Variables

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

Generate migrations

```bash
npm run db:generate
```

Push schema

```bash
npm run db:push
```

Run migrations

```bash
npm run db:migrate
```

Open Drizzle Studio

```bash
npm run db:studio
```

---

## Running the Project

Start both frontend and backend.

```bash
npm run dev
```

Production build

```bash
npm run build
```

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

## Developed by

**Shirsendu Mali**  
Full Stack Developer  
Kolkata, India
