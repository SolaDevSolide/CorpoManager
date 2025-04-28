# Stage 1: build
FROM node:23-alpine AS builder
WORKDIR /app

# Install deps & build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production image
FROM node:23-alpine
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --production

# Copy Next.js build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npx", "next", "start"]