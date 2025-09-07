FROM node:20-bookworm-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install system dependencies required by Prisma (OpenSSL) and Node
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
