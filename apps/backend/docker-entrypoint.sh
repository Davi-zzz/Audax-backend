#!/bin/sh

echo "Running Prisma migrations..."

pnpm prisma migrate deploy

echo "Starting backend..."

exec "$@"
