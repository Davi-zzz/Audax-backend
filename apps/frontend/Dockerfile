FROM node:24-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend ./apps/frontend

RUN pnpm install --frozen-lockfile


FROM base AS development

WORKDIR /app/apps/frontend

CMD ["pnpm", "dev", "-H", "0.0.0.0"]


FROM base AS build

WORKDIR /app/apps/frontend

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN pnpm build


FROM node:24-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.34.5 --activate

COPY --from=build /app/apps/frontend/.next ./apps/frontend/.next
COPY --from=build /app/apps/frontend/public ./apps/frontend/public
COPY --from=build /app/apps/frontend/package.json ./apps/frontend/package.json
COPY --from=base /app/node_modules ./node_modules

WORKDIR /app/apps/frontend

CMD ["pnpm", "start"]
