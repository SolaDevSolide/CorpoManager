# Contributing to Star Citizen Corp Manager

First off, thanks for considering contributing! 🙌  
We welcome contributions to **code**, **documentation**, and **feature ideas**.

---

## 📌 Before You Start

- Make sure you're working on the latest `main` branch.
- Review the [open issues](https://https://github.com/SolaDevSolide/CorpoManager/issues) for ideas.
- For significant changes, please open a discussion or draft PR first.

---

## 🛠 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/SolaDevSolide/CorpoManager.git
cd CorpoManager
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run services locally

```bash
# With Docker (recommended for full stack)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Or run services manually from `packages/frontend/` and `packages/backend/`.

----------

## 🧩 Contribution Types

### ✅ Bug Fixes

-   Submit fixes with clear commit messages.

-   Add regression tests if applicable.


### ✅ Features

-   Use the Feature Template for consistency.

-   Document your feature in `website/docs/features/`.

-   Add/modify tests for backend/frontend.


### ✅ Documentation

-   All project documentation lives in `website/docs/`.

-   See Docs Contribution Guide for instructions.


----------

## 🧪 Testing

### Backend (NestJS)

```bash
cd packages/backend
npm run test

```

### Frontend (Next.js)

```bash
cd packages/frontend
npm run lint
npm run typecheck

```

----------

## 📂 Code Style

-   Use ESLint and Prettier (`npm run lint`)

-   Follow existing patterns and naming conventions

-   Use TypeScript types and interfaces


----------

## 🧠 Feature Documentation

Every new feature must include:

-   A `.md` file in `website/docs/features/`

-   Description, flow, endpoints (if any), and how to extend


Example:  
`features/auth.md`

----------

## ✅ Pull Request Checklist

Before submitting:

-   Code builds without errors

-   Tests pass

-   Linting passes (`npm run lint`)

-   Documentation added or updated

-   Linked related issues or PRs


----------

## 📣 Community & Help

-   Create or comment on Issues to discuss bugs or proposals

-   Use `discussions/` for broader architectural questions

-   Label easy issues as `good first issue` to help new contributors


----------

## 📜 License

By contributing, you agree that your code will be licensed under the project's GPL license.