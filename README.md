# Star Citizen Corp Manager

A full-stack, real-time organization and asset manager for the Star Citizen universe.

---

## 📚 Documentation

Looking for technical details, API info, or contribution guides?

➡️ **[View Full Documentation](https://SolaDevSolide.github.io/CorpoManager/)**
*(Built with [Docusaurus](https://docusaurus.io/) and continuously deployed via GitHub Pages)*

---

## 📦 Features

- **User Management** – Registration, login, role-based access, secure auth
- **API Access** – Fully documented REST API (Swagger/OpenAPI)
- **Testing & Modularity** – Unit, integration, and E2E test coverage

---

## 🛠 Tech Stack

- **Frontend**: Next.js (React) + TypeScript + TailwindCSS  
- **Backend**: NestJS + Prisma ORM  
- **Database**: PostgreSQL + Redis (Pub/Sub)  
- **Realtime**: WebSocket Gateway (NestJS) + Redis  
- **CI/CD**: GitHub Actions + Docker + GitHub Pages (for Docs)

---

## 📁 Project Structure

```txt
/
├── packages/
│   ├── backend/      # NestJS backend
│   └── frontend/     # Next.js frontend
├── website/          # Docusaurus documentation site
├── docker-compose.yml
├── .env
└── README.md
```

---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:SolaDevSolide/CorpoManager.git
cd CorpoManager
```

### 2. Set Up Environment Variables

Copy and customize the following into a `.env` file at the root:

```env
POSTGRES_USER=corp_user
POSTGRES_PASSWORD=supersecret
POSTGRES_DB=corpdb
REDIS_PASSWORD=
FRONTEND_PORT=3000
BACKEND_PORT=3001
JWT_SECRET=supersecret
DATABASE_URL=postgresql://corp_user:supersecret@postgres:5432/corpdb?schema=public
```

### 3. Run in Production

```bash
docker-compose up --build -d
```

### 4. Run in Development

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Or run manually:

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

## 🧰 Available Scripts

<details>
<summary>Frontend</summary>

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # Linting
npm run typecheck # Type checking
```

</details>

<details>
<summary>Backend</summary>

```bash
npm run start:dev       # Hot-reload dev server
npm run build           # Compile TypeScript
npm run start           # Run compiled backend
npm run prisma:migrate  # Apply DB migrations
npm run test            # Run unit/e2e tests
```

</details>

<details>
<summary>Documentation</summary>

```bash
npm run docs            # Start Docusaurus docs site (from root)
```

</details>

---

## 🤝 Contributing

1. Fork the repo & create a feature branch
2. Follow the [contributing guide](https://SolaDevSolide.github.io/CorpoManager/contributing)
3. Write tests and documentation for your changes
4. Open a Pull Request

---

## 📝 License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](./LICENSE) for details.