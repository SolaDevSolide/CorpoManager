---
title: Getting Started Guide
---
# Getting Started

## Clone the Repo

```bash
git clone git@github.com:SolaDevSolide/CorpoManager.git
cd CorpoManager
```

## Set Up `.env`

Create a `.env` file in the root. Use values like:

```env
POSTGRES_USER=corp_user
POSTGRES_PASSWORD=supersecret
JWT_SECRET=jwt_secret
DATABASE_URL=postgresql://...
```

For a full list of available environment variables, check the [Environment Variables Reference](environment-variables).

## Run in Production

```bash
docker-compose up --build -d
```

## Run in Development

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Or manually:

```bash
# Frontend
cd packages/frontend
npm install
npm run dev

# Backend
cd ../backend
npm install
npm run start:dev
```