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

# Copy package files for production dependencies
COPY package.json bun.lockb* ./

# Install all dependencies (vite is needed for preview command)
RUN bun install --frozen-lockfile

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

# Start the application with preview (serves the built dist folder)
CMD ["bun", "run", "preview", "--host", "0.0.0.0", "--port", "5173"]