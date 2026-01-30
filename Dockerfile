# Stage 1: Build the Client
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies and build
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: Setup the Server
FROM node:20-alpine AS production
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Install production dependencies for server
WORKDIR /app/server
RUN npm ci --only=production

# Copy server code
COPY server/ ./

# Copy built client assets to server's public directory
COPY --from=client-builder /app/client/dist ./public

# Environment variables (Defaults, should be overridden)
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "index.js"]
