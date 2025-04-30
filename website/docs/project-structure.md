---
title: Project Structure
---
# Project Structure

The project follows a monorepo structure with shared tooling and workspace management.

## Root
- `.env` — Global environment variables
- `docker-compose.yml` — Prod services
- `docker-compose.dev.yml` — Dev overrides
- `package.json` — Shared scripts & dependencies

## Monorepo Packages

### `packages/frontend`
- Next.js frontend
- TailwindCSS, API calls, and state management

### `packages/backend`
- NestJS backend
- Prisma ORM
- REST APIs with Swagger
- WebSocket gateway