# ============================================================
# STAGE 1: BUILDER
# ------------------------------------------------------------
# This stage is only used to build (compile) the application
# It installs all dependencies (including devDependencies)
# compiles TypeScript into JavaScript, and prepares the build
# Nothing from this stage will run in production directly
# ============================================================

# Use the official Node.js 22 image based on Alpine Linux
# Alpine is lightweight, making Docker images smaller
# "AS builder" gives this stage a name so that we can copy
# files from it later in the production stage
FROM node:22-alpine AS builder

# Set the working directory inside the container
# Every following command will run inside /app
# If /app does not exist, Docker creates it automatically
WORKDIR /app

# Copy only package.json and package-lock.json first
# Why not copy the whole project?
# Docker caches layers
# If only our source code changes but package.json stays the same
# Docker can reuse the cached "npm ci" layer instead of installing
# dependencies again, making future builds much faster
# ./ means inside WORKDIR, i.e. /app/
COPY package*.json ./

# Install all dependencies
RUN npm install

# Now copy the entire project source code
# First "."  -> our local project folder (/ai-mock-interview-platform/server/)
# Second "." -> current working directory (/app) inside container
COPY . .

# Compile the TypeScript project to JavaScript
RUN npm run build



# ============================================================
# STAGE 2: PRODUCTION
# ------------------------------------------------------------
# This stage creates the final production image
# It starts from a fresh Node.js image, installs only production
# dependencies, copies the compiled JavaScript from the builder stage, and runs the application
# This keeps the final image:
# - Smaller
# - Cleaner
# - More secure (as dev dependencies not included, so unwanted vulnerabilities are omitted)
# ============================================================

# Start from a completely fresh Node.js image
# This stage does not contain:
# - TypeScript source files
# - TypeScript compiler
# - Dev dependencies
# - Build cache
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /app

# Copy package files again because we need them to install production dependencies
# ./ means inside WORKDIR, i.e. /app/
# This is not the /app from stage 1, it is a completely new /app created in this stage
COPY package*.json ./

# Install only runtime dependencies (--omit=dev helps ignoring dev dependencies)
RUN npm install --omit=dev

# Copy only the compiled JavaScript from the builder stage
# --from=builder
# tells Docker:
# "Take files from the stage named 'builder'."
# Source:
#   Builder stage -> /app/dist
# Destination:
#   Production stage -> /app/dist
# Notice that we do not copy:
# - src/
# - node_modules from builder
# - TypeScript files
# - build tools
# Only the compiled application is copied
COPY --from=builder /app/dist ./dist

# Inform Docker that the application listens on port 8000
# This is documentation for Docker and people reading the image
# It does not publish the port automatically
# Port mapping happens when running:
# docker run -p 8000:8000 image-name
EXPOSE 8000

# Periodically check whether the application is healthy
# Docker will call:
# http://localhost:8000/health
# If the endpoint returns success (HTTP 200), the container is considered healthy.
# If it fails repeatedly, Docker marks the container as "unhealthy"
# Options:
# --interval=30s      -> Check every 30 seconds
# --timeout=20s       -> Wait up to 20 seconds for a response
# --start-period=40s  -> Give the app 40 seconds to start before checking
# --retries=3         -> Mark unhealthy after 3 consecutive failures
# "wget -qO-" prints the response quietly
# "exit 1" tells Docker the health check failed
HEALTHCHECK --interval=30s --timeout=20s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:8000/health || exit 1

# Default command that runs when the container starts
# RUN executes while building the image
# CMD executes only when a container is started from the built image
# This starts the compiled JavaScript application
CMD ["node", "dist/index.js"]



# To build the Docker image, run:
# docker build -t ai-mock-interviewer-server .
# -t means tag (name), give tag name (here, 'ai-mock-interviewer-server')
# . means Dockerfile is located in the current directory
