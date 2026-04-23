# Use Node.js LTS
FROM node:20

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install netcat
RUN apt-get update && apt-get install -y netcat-openbsd

# Install dependencies
RUN npm install

# Copy project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start app
CMD ["sh", "scripts/start.sh"]