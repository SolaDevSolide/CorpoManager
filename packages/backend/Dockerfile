# ─── Stage 1: build ─────────────────────────────────────────────────────
FROM node:23 AS builder
WORKDIR /app

# Install curl without caching apk indexes
#RUN apk add --no-cache curl

# 1. Install deps (including dev-deps)
COPY package*.json ./
RUN npm ci

# 2. Copy the Prisma schema so prisma can generate
COPY prisma ./prisma

# 3. Generate the Prisma client
RUN npx prisma generate

# 4. Copy the rest of the source and build
COPY . .
RUN npm run build


# ─── Stage 2: production image ─────────────────────────────────────────
FROM node:23-alpine
WORKDIR /app

# Only production deps
COPY package*.json ./
RUN npm ci --production

# Copy built files & prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main"]