FROM node:20-bookworm

WORKDIR /app

# postgresql-client provides pg_isready, used by start.sh to wait for the DB
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

# Generate Prisma client targeting the container's OpenSSL version
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
