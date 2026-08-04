# ==============================================================================
# Makefile - Developer shortcuts for the PROJECT
#
# Run commands using:
#   make <target>
#
# Examples:
#   make dev
#   make build
#   make health
#
# Why use a Makefile?
# - Gives short, memorable commands instead of long terminal commands
# - Works on Linux/macOS and is widely used in professional projects
# - Keeps all common project commands in one place
#
# IMPORTANT:
# Every command inside a target MUST start with a TAB character, not spaces
# ==============================================================================


# ==============================================================================
# QUICK SYMBOL CHEAT SHEET
#
# @          Hide the command itself, show only its output
# &&         Run next command only if previous succeeds
# ||         Run next command only if previous fails
# |          Pass output of one command to another
# 2>&1       Merge error output (2 -> stderr) with normal output (1 -> stdout)
# $(VAR)     Read a Makefile variable
# $$1, $$2   Escape $ so awk receives $1, $2
# \          Continue the same command on the next line
# ==============================================================================


# .PHONY tells Make these are command names, NOT actual files
# Without this, if a file named "build" exists, `make build`
# may think the job is already done and skip running the command
.PHONY: \
	dev build install start \
	server-dev server-build server-start \
	db-generate db-migrate db-push db-studio \
	health health-prod logs \
	clean clean-build \
	docker-build docker-up docker-down docker-logs docker-ps docker-restart \
	status help


# Default target
# Running just `make` is the same as running `make help`
.DEFAULT_GOAL := help


# ==============================================================================
# Development
# ==============================================================================

# Start both frontend and backend in development mode
# Usually enables hot reload, so changes appear automatically
dev: ## Start both frontend and backend in development mode
	npm run dev

# Create production builds of both frontend and backend
# Run this before deploying
build: ## Build both frontend and backend
	npm run build

# Start both frontend and backend in production mode
# Use this after building the project
start: ## Start frontend and backend in production mode
	npm run start

# Install every dependency listed in package.json
# Usually run after cloning the project
install: ## Install project dependencies
	npm install


# ==============================================================================
# Server Only
# ==============================================================================

# Start only the backend in development mode
server-dev: ## Start backend only in development mode
	npm run dev --prefix server

# Build only the backend for production
server-build: ## Build backend only
	npm run build --prefix server

# Start the already-built backend
# Unlike dev mode, this does not watch for file changes
# Make sure to run `make server-build` first
server-start: ## Start backend in production mode
	npm run start --prefix server


# ==============================================================================
# Database (Drizzle ORM)
# ==============================================================================

# Compare our schema with the previous one and generate SQL migration files
# Commit these migration files to Git
db-generate: ## Generate Drizzle migration files
	npm run db:generate

# Execute all pending migration files on the database
# Keeps the database structure in sync with our project
db-migrate: ## Apply pending migrations
	npm run db:migrate

# Push the latest schema directly to the database
# Faster for development, but skips migration files
# Avoid using this in production
db-push: ## Push schema directly to DB (development only)
	npm run db:push

# Open Drizzle Studio in browser
# Lets us view and edit database tables visually
db-studio: ## Open Drizzle Studio
	npm run db:studio


# ==============================================================================
# Health & Monitoring
# ==============================================================================

# Check if our local backend is running correctly
# Calls the /health endpoint and prints the JSON response
# curl -> Send an HTTP request
# -f -> Fail if the server returns 4xx/5xx
# python3 -m json.tool -> Format JSON for easier reading
# || -> Run the next command only if the previous command fails
# -s -> Silent mode (hides progress bar)
# -w "\n" -> Print a newline after the response so terminal prompt starts on a new line
health: ## Check local backend health
	@echo "Checking server health..."
	@curl -f -s -w "\n" http://localhost:8000/health | python3 -m json.tool || echo "Server is not running or unhealthy"

# Check the deployed (production) backend instead of localhost
# Pass the production backend URL while running:
# make health-prod RENDER_URL=https://our-app.onrender.com
# -z -> True if the string is empty
# Exit with an error (0 = success, 1 = failure)
health-prod: ## Check production backend health
	@if [ -z "$(RENDER_URL)" ]; then \
		echo "Usage: make health-prod RENDER_URL=https://our-app.onrender.com"; \
		exit 1; \
	fi
	@echo "Checking production health at $(RENDER_URL)/health ..."
	@curl -f -s -w "\n" $(RENDER_URL)/health | python3 -m json.tool || echo "Production server is not running or unhealthy"


# ==============================================================================
# Logs
# ==============================================================================

# Start the backend and display logs in a readable format
# Press Ctrl + C to stop
# 2>&1 -> Merge error output (stderr) with normal output (stdout)
# | -> Send all logs to the next command
# npx pino-pretty -> Convert Pino's JSON logs into readable logs
# --colorize -> Add colors to log levels
logs: ## Follow server logs in real time
	@echo "Following server logs (Ctrl+C to stop)..."
	@cd server && npm run dev 2>&1 | npx pino-pretty --colorize


# ==============================================================================
# Docker
# ==============================================================================

# Build Docker images for all services defined in docker-compose.yml
# This reads each service's Dockerfile and creates fresh Docker images
# Use this when:
# - change a Dockerfile
# - update project dependencies
# - want to rebuild images from the latest source code
#
# --build forces Docker Compose to rebuild the images before starting containers
# --no-start means - don't start the container
docker-build: ## Build Docker images
	@docker compose up --build --no-start

# Build (if needed) and start all services
# If containers already exist, Docker Compose starts them
# If they do not exist, it creates them first
# -d (detached mode) runs containers in the background, allowing the terminal to be used for other commands
docker-up: ## Build and start all services
	@docker compose up --build -d

# Stop and remove all containers, networks and other temporary resources
# created by Docker Compose
# Images and volumes are kept unless additional flags are provided
docker-down: ## Stop and remove all services
	@docker compose down

# Display live logs from every running service
# -f (follow) keeps listening for new log messages until Ctrl+C is pressed
docker-logs: ## Follow Docker logs
	@docker compose logs -f

# List all services managed by Docker Compose along with their current state,
# such as running, exited or restarting
docker-ps: ## Show Docker service status
	@docker compose ps

# Restart all running services without rebuilding the Docker images
# Useful when:
# - Environment variables change
# - A service becomes unresponsive
# - Want to quickly restart containers
docker-restart: ## Restart all services
	@docker compose restart


# ==============================================================================
# Cleanup
# ==============================================================================

# Remove everything that can be regenerated
# Useful if our project behaves strangely or we want a fresh setup
# rm -> Remove files/folders
# -r -> Delete folders recursively
# -f -> Force deletion without asking
clean: ## Remove build files and all installed dependencies
	@echo "Cleaning build files..."
	rm -rf client/dist server/dist
	@echo "Removing node_modules..."
	rm -rf node_modules client/node_modules server/node_modules
	@echo "Clean complete. Run 'make install' to reinstall dependencies."

# Remove only compiled build files
# Keeps node_modules, so reinstalling isn't needed
clean-build: ## Remove only build files
	rm -rf client/dist server/dist
	@echo "Build files removed."


# ==============================================================================
# Git Helpers
# ==============================================================================

# Quick overview of our repository
# Helpful before committing or pushing changes
# Shows modified, staged and untracked files
# Print a blank line for better readability
# git log -> Show commit history
# --oneline -> One commit per line (short format)
# -10 -> Show only the latest 10 commits
status: ## Show Git status and recent commits
	@git status
	@echo ""
	@echo "Recent commits:"
	@git log --oneline -10


# ==============================================================================
# Help
# ==============================================================================

# Show all available Make commands automatically
# Any target that has a "##" comment will appear in this list
#
# Example:
# build: ## Build the project
#
# Output:
# make build          Build the project
# $(MAKEFILE_LIST) is a built-in Make variable that contains
# the path(s) of the current Makefile(s)
# grep finds all lines containing "##" while reads one matching line at a time
# cut extracts:
#   - command name (before ':')
#   - description (after '##')
# printf prints everything in aligned columns
help: ## Show this help message
	@echo ""
	@echo "AI Mock Interview Platform - Available Commands:"
	@echo ""
	@grep "##" $(MAKEFILE_LIST) | while IFS= read -r line; do \
		cmd=$$(echo "$$line" | cut -d: -f1); \
		desc=$$(echo "$$line" | cut -d'#' -f3-); \
		printf "  make %-20s %s\n" "$$cmd" "$$desc"; \
	done
	@echo ""
