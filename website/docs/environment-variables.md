---
title: Environment Variables
---
# Environment Variables

The app uses multiple environment variables for DB access, ports, and secrets.

## Required in `.env`

```env
# PostgreSQL
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=corpdb

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_pass

# Service ports
FRONTEND_PORT=3000
BACKEND_PORT=3001

# JWT
JWT_SECRET=your-very-long-random-string-here
JWT_EXPIRES_IN=3600s# tokens valid for 1 hour


# Backend
DATABASE_URL=postgresql://user:pass@postgres:5432/corpdb?schema=public
```