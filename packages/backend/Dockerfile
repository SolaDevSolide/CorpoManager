# ─── Stage 1: build ─────────────────────────────────────────────────────
FROM node:23-alpine AS builder
WORKDIR /app

# 1. Install deps (including dev-deps)
COPY package*.json ./
RUN npm ci

# 2. Copy your Prisma schema **and** your .env so prisma generate can read DATABASE_URL
COPY prisma ./prisma
COPY .env .env

# 3. Generate the Prisma client
RUN npx prisma generate

# 4. Copy the rest of your source and build
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