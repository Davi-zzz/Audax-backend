FROM node:22-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend ./apps/backend
COPY apps/backend/docker-entrypoint.sh ./apps/backend/docker-entrypoint.sh

RUN chmod +x ./apps/backend/docker-entrypoint.sh

RUN pnpm install --frozen-lockfile

RUN pnpm --filter backend prisma:generate

FROM base AS development

WORKDIR /app/apps/backend

ENTRYPOINT ["/app/apps/backend/docker-entrypoint.sh"]

CMD ["pnpm", "dev"]


FROM base AS build

WORKDIR /app/apps/backend

RUN pnpm build

FROM node:22-slim AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=base /app/apps/backend/docker-entrypoint.sh ./apps/backend/docker-entrypoint.sh

WORKDIR /app/apps/backend

ENTRYPOINT ["/app/apps/backend/docker-entrypoint.sh"]

CMD ["node", "dist/main.js"]
