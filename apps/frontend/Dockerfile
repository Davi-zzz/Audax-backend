# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack use pnpm@latest

# Copy monorepo files
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend ./apps/frontend
COPY packages/shared-types ./packages/shared-types

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build frontend
WORKDIR /app/apps/frontend
RUN pnpm build

# Runtime stage
FROM node:24-alpine

WORKDIR /app/apps/frontend

# Install pnpm
RUN corepack enable && corepack use pnpm@latest

# Copy built app from builder
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/package.json ./
COPY --from=builder /app/apps/frontend/public ./public

# Environment
ENV NODE_ENV=production
ENV PORT=3000
# NEXT_PUBLIC_API_URL will be passed by docker-compose

EXPOSE 3000

CMD ["npm", "run", "start"]
