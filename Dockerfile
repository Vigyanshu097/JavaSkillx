# Multi-stage production Dockerfile for JavaSkillX
FROM node:22-bullseye-slim AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy application sources
COPY . .

# Build frontend production bundle
RUN npm run build

# Stage 2: Production Runtime with OpenJDK 17
FROM node:22-bullseye-slim

WORKDIR /app

# Install OpenJDK 17 and curl for healthchecks
RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-17-jdk-headless curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy production node_modules and built assets
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose dev/prod port 3000
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/achievements || exit 1

# Start the full-stack server
CMD ["npx", "tsx", "server.ts"]
