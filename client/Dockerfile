# ============================================================
# STAGE 1: BUILDER
# ============================================================

# Pull the official Node.js 22 image based on Alpine Linux to build the React application
FROM node:22-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
# If package.json hasn't changed, npm install won't re-run on next build as the layer is cached
COPY package*.json ./

# Install all dependencies
RUN npm install

# Now copy the entire React project source code
COPY . .

# Build the React app for production
# This creates the dist/ folder with optimized HTML, CSS, JS
# During Vite build, VITE_ env variables are bundled into frontend's JavaScript
# Unlike normal env variables, which are injected during server start
# That's why ARG is used, because during build time the variables are needed to be available
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_API_BASE_URL
ARG VITE_RAZORPAY_KEY_ID

RUN npm run build



# ============================================================
# STAGE 2: PRODUCTION
# ============================================================

# Use Nginx to serve the built static files (HTML, CSS, JS)
# nginx:alpine is tiny (only ~25MB)
FROM nginx:alpine AS production

# Remove the default Nginx configuration
# We will replace it with our own
RUN rm /etc/nginx/nginx.conf

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the built React files from Stage 1 into Nginx's serving directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Document that this container serves on port 80
EXPOSE 80

# Health check, erify Nginx is serving files correctly
HEALTHCHECK --interval=30s --timeout=20s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:80 || exit 1

# Start Nginx in the foreground
# "daemon off" means Nginx runs as main process, not background
# Docker needs the main process to stay running, if it goes background, container exits
CMD ["nginx", "-g", "daemon off;"]
