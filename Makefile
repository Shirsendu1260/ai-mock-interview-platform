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
# Unlike dev mode, this does NOT watch for file changes
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
# Calls the /health endpoint and prints the JSON response.
health: ## Check local backend health
	@echo "Checking server health..."
	# curl -> Send an HTTP request
	# -f -> Fail if the server returns 4xx/5xx
	# python3 -m json.tool -> Format JSON for easier reading
	# || -> Run the next command only if the previous command fails
	@curl -f http://localhost:8000/health | python3 -m json.tool || echo "Server is not running or unhealthy"

# Check the deployed (production) backend instead of localhost
# Pass the production backend URL while running:
# make health-prod RENDER_URL=https://our-app.onrender.com
health-prod: ## Check production backend health
	# -z -> True if the string is empty
	@if [ -z "$(RENDER_URL)" ]; then \
		echo "Usage: make health-prod RENDER_URL=https://our-app.onrender.com"; \
		exit 1; \  # Exit with an error (0 = success, 1 = failure)
	fi
	@echo "Checking production health at $(RENDER_URL)/health ..."
	# Same as the local health check, but uses our deployed URL
	@curl -f $(RENDER_URL)/health | python3 -m json.tool || echo "Production server is not running or unhealthy"


# ==============================================================================
# Logs
# ==============================================================================

# Start the backend and display logs in a readable format
# Press Ctrl + C to stop
logs: ## Follow server logs in real time
	@echo "Following server logs (Ctrl+C to stop)..."
	# 2>&1 -> Merge error output (stderr) with normal output (stdout)
	# | -> Send all logs to the next command
	# npx pino-pretty -> Convert Pino's JSON logs into readable logs
	# --colorize -> Add colors to log levels
	@cd server && npm run dev 2>&1 | npx pino-pretty --colorize


# ==============================================================================
# Cleanup
# ==============================================================================

# Remove everything that can be regenerated
# Useful if our project behaves strangely or we want a fresh setup
clean: ## Remove build files and all installed dependencies
	@echo "Cleaning build files..."
	# rm -> Remove files/folders
	# -r -> Delete folders recursively
	# -f -> Force deletion without asking
	rm -rf client/dist server/dist
	@echo "Removing node_modules..."
	# Delete all installed packages
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
status: ## Show Git status and recent commits
	# Shows modified, staged and untracked files
	@git status
	# Print a blank line for better readability
	@echo ""
	@echo "Recent commits:"
	# git log -> Show commit history
	# --oneline -> One commit per line (short format)
	# -10 -> Show only the latest 10 commits
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
