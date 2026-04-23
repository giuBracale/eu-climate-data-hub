#!/bin/sh

echo " Waiting for PostgreSQL..."

until nc -z postgres 5432; do
  sleep 1
done

echo " Database is ready"

echo " Running migrations..."
npx prisma migrate deploy

echo " Checking if data already exists..."

COUNT=$(node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const count = await prisma.climateData.count();
  console.log(count);
  process.exit(0);
})();
")

if [ "$COUNT" -gt "0" ]; then
  echo " Data already present, skipping ingestion and processing"
else
  echo " Running ingestion pipeline..."
  node src/pipelines/worldbankIngestion.pipeline.js ITA

  echo " Running processing pipeline..."
  node src/pipelines/climateDataProcessingPipeline.js
fi

echo " Starting API..."
node src/index.js