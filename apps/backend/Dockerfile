# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack use pnpm@latest

# Copy monorepo files
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend ./apps/backend

# Install dependencies (ignore build script warnings)
RUN pnpm install --frozen-lockfile || true

# Generate Prisma client
WORKDIR /app/apps/backend
RUN pnpm exec prisma generate

# Build backend
RUN pnpm build

# Runtime stage
FROM node:24-alpine

WORKDIR /app/apps/backend

# Install pnpm
RUN corepack enable && corepack use pnpm@latest

# Copy built app from builder
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/apps/backend/prisma ./prisma

# Environment
ENV NODE_ENV=production
ENV PORT=3000
# REPOSITORY_TYPE will be passed by docker-compose (in-memory or prisma)
# DATABASE_URL will be passed by docker-compose (if REPOSITORY_TYPE=prisma)

EXPOSE 3000

CMD ["node", "dist/main"]
