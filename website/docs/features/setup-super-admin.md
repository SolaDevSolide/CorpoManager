---
title: Super-Admin Bootstrap CLI
---
# Super-Admin Setup (CLI)

## Overview
A standalone Node.js CLI script to create the first `SUPER_ADMIN` user in a fresh database. It prompts interactively, hashes the password, and writes to the database.

## Purpose
- Simplify initial project setup in new environments.
- Prevent manual database fiddling for critical admin account.

## Architecture / Flow

1. **Check Existing**
    - `prisma.user.findFirst({ where: { role: SUPER_ADMIN } })`
2. **Interactive Prompt**
    - Uses Inquirer to ask for email, name, and password (masked).
3. **Hash Password**
    - Argon2 hashes the provided plaintext password.
4. **Create User**
    - `prisma.user.create({ data: { email, name, password: hash, role: SUPER_ADMIN } })`
5. **Return**
    - Script prints or returns the created user.

## Key Files & Modules

- **`packages/backend/src/cli/setup-super-admin.logic.ts`**  
  Encapsulates the prompt → hash → create flow.
- **Prisma client import** from `src/prisma/prisma.ts`.

## CLI Usage

```bash
# From repo root
npx ts-node packages/backend/src/cli/setup-super-admin.logic.ts

# If added to package.json scripts
npm run setup-super-admin
```

## Testing Notes

-   Tests in `packages/backend/test/cli/setup-super-admin.logic.spec.ts`

    -   Mocks Inquirer, Argon2, and Prisma’s `findFirst`/`create` methods.


## How to Contribute or Extend

-   **Custom prompts**: add new fields (e.g. phone number) to Inquirer questions and Prisma schema.

-   **Non-interactive mode**: accept CLI args or environment variables for automation.


## Related Links

- [Prisma Schema](./prisma-schema)
- [Authentication](./authentication)