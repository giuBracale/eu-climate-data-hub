#!/bin/sh

set -e

DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"

echo "Waiting for PostgreSQL at ${DB_HOST}:${DB_PORT}..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -q; do
  sleep 2
done
echo "PostgreSQL is ready."

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting API..."
exec npm run start:prod
