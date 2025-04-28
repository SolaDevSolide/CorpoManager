# Star Citizen Corp Manager

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Project Structure](#project-structure)  
- [Environment Variables](#environment-variables)  
- [Getting Started](#getting-started)  
  - [1. Clone Repository](#1-clone-repository)  
  - [2. Create `.env`](#2-create-env)  
  - [3. Run in Production](#3-run-in-production)  
  - [4. Run in Development](#4-run-in-development)  
- [Available Scripts](#available-scripts)  
- [Contributing](#contributing)  
- [License](#license)

---

## Features

- **User Management** (registration, login, roles, secure password hashing)  
- **Corp & Asset CRUD** (corporations, divisions, members, assets)  
- **Real-Time Game State** (fleet positions, market data, alerts, chat)  
- **Notifications** (WebSocket pushes, email/webhook hooks)  
- **API Access** (auto-generated Swagger/OpenAPI docs)  
- **Modular & Testable** (unit, integration, e2e tests)  

---

## Tech Stack

- **Frontend**: React + Next.js + TypeScript + TailwindCSS  
- **Backend**: NestJS + TypeScript + Prisma ORM  
- **DB & Cache**: PostgreSQL (persistent) + Redis (real-time)  
- **Realtime**: WebSocket Gateway (`@nestjs/websockets`) + Redis Pub/Sub  
- **Containerization**: Docker & Docker Compose  
- **CI/CD**: GitHub Actions  
- **Monitoring**: Sentry, Prometheus & Grafana  

---

## Prerequisites

- [Git](https://git-scm.com/)  
- [Node.js](https://nodejs.org/) v23+ & npm (or yarn)  
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)  
- (Optional) [GitHub CLI `gh`](https://cli.github.com/)  

---

## Project Structure

```
/
├── .env                   # root environment vars
├── docker-compose.yml     # production services
├── docker-compose.dev.yml # development overrides
├── packages/
│   ├── frontend/          # Next.js app
│   │   ├── Dockerfile
│   │   └── …  
│   └── backend/           # NestJS app
│       ├── Dockerfile
│       ├── prisma/
│       │   └── schema.prisma
│       └── …  
└── README.md
```

---

## Environment Variables

Create a file named `.env` at the project root. Example:

```dotenv
# PostgreSQL
POSTGRES_USER=corp_user
POSTGRES_PASSWORD=supersecret
POSTGRES_DB=corpdb

# Redis (leave blank if no AUTH)
REDIS_PASSWORD=

# Service ports
FRONTEND_PORT=3000
BACKEND_PORT=3001

# Backend
JWT_SECRET=jwt_secret
DATABASE_URL=postgresql://corp_user:supersecret@postgres:5432/corpdb?schema=public
```

- `POSTGRES_*` — credentials for the Postgres service
- `REDIS_PASSWORD` — optional Redis AUTH password
- `FRONTEND_PORT`, `BACKEND_PORT` — host ports for mapping
- `JWT_SECRET` — secret key for signing JWTs (backend only)
- `DATABASE_URL` — Prisma connection string (backend only)

---

## Getting Started

### 1. Clone Repository

```bash
git clone git@github.com:<org-or-user>/star-citizen-corp-manager.git
cd star-citizen-corp-manager
```

### 2. Create `.env`

Copy the example above into a file named `.env` in the root, and also into `packages/backend/.env` (for backend-specific vars).

### 3. Run in Production

Build and start all services with the production Dockerfiles:

```bash
docker-compose up --build -d
```

- **Frontend** available at `http://localhost:${FRONTEND_PORT}`
- **Backend** API at `http://localhost:${BACKEND_PORT}`
- **Postgres** on port `5432`, **Redis** on `6379`

### 4. Run in Development

Start with hot-reload enabled for both services:

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

- Mounts your local code into frontend/backend containers
- Runs `npm run dev` (Next.js) and `npm run start:dev` (NestJS)
- Live-reload on file changes

You can also run each service locally without Docker:

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

---

## Available Scripts

<details>
<summary>Frontend (packages/frontend)</summary>

```bash
npm run dev       # development server
npm run build     # production build
npm run start     # start production server
npm run lint      # ESLint
npm run typecheck # TS type check
```
</details>

<details>
<summary>Backend (packages/backend)</summary>

```bash
npm run start:dev    # watch + hot-reload
npm run build        # compile TS → JS
npm run start        # run compiled code
npm run prisma:migrate  # run Prisma migrations
npm run prisma:generate  # regenerate client
npm run lint
npm run test         # unit & e2e tests
```
</details>

---

## Contributing

1. Fork the repo & create a feature branch
2. Read and follow [CONTRIBUTING.md](./CONTRIBUTING.md)
3. Open a Pull Request — include tests & documentation
4. Label issues as **first-timer** to help newcomers

---

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](./LICENSE) for full details.