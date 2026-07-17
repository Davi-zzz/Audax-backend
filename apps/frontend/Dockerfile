FROM node:24-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack use pnpm@latest

# Copy monorepo files
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend ./apps/frontend

# Install dependencies (ignore build script warnings)
RUN pnpm install --frozen-lockfile || true

# Set working directory to frontend
WORKDIR /app/apps/frontend

# Environment
ENV NODE_ENV=development
ENV PORT=3000
# NEXT_PUBLIC_API_URL will be passed by docker-compose

EXPOSE 3000

# Run in dev mode
CMD ["pnpm", "dev"]
