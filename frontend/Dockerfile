# Multi-stage build for optimized production image

# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app/frontend

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:latest AS production

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r frontend && useradd -r -g frontend frontend

WORKDIR /app/frontend

# Copy built application from builder stage
COPY --from=builder /app/frontend/dist ./dist

# Change ownership to non-root user
RUN chown -R frontend:frontend /app/frontend
USER frontend

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5173/ || exit 1

# Start a simple HTTP server to serve the dist folder
CMD ["bun", "run", "--cwd", "/app/frontend", "bunx", "http-server", "dist", "-p", "5173", "-g"]