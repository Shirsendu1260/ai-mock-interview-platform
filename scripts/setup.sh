#!/bin/bash
# ==============================================================================
# setup.sh - First-time project setup
#
# Run once after cloning the project
#
# Usage:
#   chmod +x scripts/setup.sh   # Make this script executable (only once)
#   ./scripts/setup.sh          # Execute the script
#
# This script:
#   1. Checks required tools
#   2. Installs dependencies
#   3. Creates missing .env files
#   4. Gives next-step instructions
# ==============================================================================


# Exit immediately if any command fails
# Prevents the project from ending up in a half-configured state
set -e


# ==============================================================================
# Terminal Colors
# ==============================================================================

# Variables store ANSI color codes
# ${GREEN}, ${RED}, etc. are replaced with these values when printed

GREEN='\033[0;32m'   # Green text
YELLOW='\033[1;33m'  # Yellow text
RED='\033[0;31m'     # Red text
NC='\033[0m'         # Reset terminal color ("No Color")


# ==============================================================================
# Welcome Message
# ==============================================================================

# echo prints text to the terminal
# "" simply prints a blank line
echo ""
echo "================================================"
echo "  AI Mock Interview Platform - Project Setup"
echo "================================================"
echo ""


# ==============================================================================
# Step 1 - Check Required Tools
# ==============================================================================

echo "Checking required tools..."

# command -v checks if a command exists on your system
# ! means "NOT"
#
# Read this as:
# "If the 'node' command does NOT exist..."
#
# &> /dev/null hides both normal output and error output
# We only care whether the command exists, not what it prints
#
# echo -e enables escape characters (like colors)
#
# Exit immediately with an error
# Exit code:
#   0 = Success
#   1 = Error
if ! command -v node &> /dev/null; then
    echo -e "${RED}ERROR: Node.js is not installed.${NC}"
    echo "Install it from: https://nodejs.org (use v20 or higher)"
    exit 1
fi

# $(...) runs a command and stores its output
#
# node --version
# Example output:
#   v22.19.0
#
# NODE_VERSION now contains that value
NODE_VERSION=$(node --version)
echo -e "${GREEN} Node.js found: ${NODE_VERSION}${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}ERROR: npm is not installed.${NC}"
    exit 1
fi

# Store npm version
NPM_VERSION=$(npm --version)
echo -e "${GREEN} npm found: ${NPM_VERSION}${NC}"
echo ""


# ==============================================================================
# Step 2 - Install Dependencies
# ==============================================================================

echo "Installing dependencies (root + client + server)..."

# Install all dependencies defined in package.json
# Since this project uses npm workspaces, one command installs:
#   - Root packages
#   - Client packages
#   - Server packages
npm install
echo -e "${GREEN} Dependencies installed${NC}"
echo ""


# ==============================================================================
# Step 3 - Create .env Files
# ==============================================================================

echo "Setting up environment files..."

# -------------------------------
# Server .env
# -------------------------------

# [ ] is Bash's way of writing a condition
# -f checks whether a file exists
# ! means "NOT".
#
# Read it as:
# "If server/.env does NOT exist..."
#
# cp = Copy file
#
# Copy:
#   server/.env.example
# to
#   server/.env
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo -e "${YELLOW} Created server/.env from server/.env.example${NC}"
    echo "  - Open server/.env and fill in your actual values"
else
    echo -e "${GREEN} server/.env already exists, skipping copy process${NC}"
fi

# -------------------------------
# Client .env
# -------------------------------

# Same logic as the server
if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo -e "${YELLOW} Created client/.env from client/.env.example${NC}"
    echo "  - Open client/.env and fill in your actual values"
else
    echo -e "${GREEN} client/.env already exists, skipping copy process${NC}"
fi

echo ""


# ==============================================================================
# Step 4 - Check OpenSSL
# ==============================================================================

# OpenSSL is commonly used to generate secure random strings
# It can be used in this project to generate access & refresh token keys
# Here, we only check if it is installed

# command -v checks whether the command exists
# If it exists, this condition is true
#
# openssl -> Cryptography tool
# rand -> Generate random data
# -hex -> Output as hexadecimal (0-9, a-f)
# 32 -> Generate 32 random bytes (64 hex characters)
if command -v openssl &> /dev/null; then
    echo -e "${GREEN}openssl found, you can generate JWT secrets${NC}"
    echo ""
    echo "Run these commands to generate secure JWT secrets:"
    echo ""
    echo -e "  ${YELLOW}openssl rand -hex 32${NC}   # ACCESS_TOKEN_SECRET_KEY"
    echo -e "  ${YELLOW}openssl rand -hex 32${NC}   # REFRESH_TOKEN_SECRET_KEY"
    echo ""
    echo "Paste each output into the corresponding field in server/.env"
else
    echo -e "${YELLOW} openssl not found, install it to generate JWT secrets${NC}"
    echo "  sudo apt install openssl"
fi


# ==============================================================================
# Setup Complete
# ==============================================================================

echo ""
echo "================================================"
echo -e "${GREEN}  Setup complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "  1. Fill in server/.env with your actual values"
echo "  2. Fill in client/.env with your actual values"
echo "  3. Run database migrations:"
echo "     make db-migrate"
echo "  4. Start the development server:"
echo "     make dev"
echo ""
