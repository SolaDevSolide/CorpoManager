---
id: testing-jest
title: Testing with Jest
sidebar_label: Jest Testing
---
# 🧪 Testing with Jest

Welcome! This guide will help you, as a new developer on our project, to write **unit tests** using **Jest**. We’ll cover:

- Where to put your test files
- How to name them
- How to mock external dependencies (Prisma, Inquirer, Argon2)
- A worked example: testing `setup-super-admin.logic.ts`

---

## 🔍 1. Repo Structure & Test Location

In our monorepo, the backend package looks like this:


```
packages/backend/
├── src/
│   ├── module-name/
│   │   └── feature.logic.ts          # your business logic
│   └── prisma/
│       └── client.ts                 # Prisma client instance (to be mocked)
├── test/
│   ├── module-name/
│   │   └── feature.logic.spec.ts     # unit test for your logic
│   └── prisma/
│       └── client.mock.ts            # shared mock of the Prisma client
├── jest.config.ts
└── jest.env-setup.ts
```

- **Source files** live under `src/…`.
- **Unit tests** mirror that tree under `test/…`, with the same folder names.
- **E2E tests** use the `*.e2e-spec.ts` suffix (and are ignored by the unit test runner).

---

## 📛 2. File Naming Conventions

- **Unit tests**: end in `.spec.ts`

```
foo.service.ts → foo.service.spec.ts
```
- **E2E tests**: end in `.e2e-spec.ts`

```
app.e2e-spec.ts
```
- Jest picks up `*.spec.ts` by default and ignores `*.e2e-spec.ts` (see `jest.config.ts`).

---

## ⚙️ 3. Jest Configuration

Here’s our `packages/backend/jest.config.ts`:

```ts
export default {
rootDir: '.',
testEnvironment: 'node',
moduleFileExtensions: ['js', 'json', 'ts'],
testRegex: '\\.spec\\.ts$',
testPathIgnorePatterns: ['\\.e2e-spec\\.ts$'],
transform: { '^.+\\.(t|j)s$': 'ts-jest' },
setupFiles: ['./jest.env-setup.ts'],
};

```

-   **`testRegex`** finds your unit tests.

-   **`testPathIgnorePatterns`** skips E2E tests.

-   **`ts-jest`** compiles TypeScript on the fly.

-   **`setupFiles`** is for any global setup (e.g. env vars).


----------

## ✍️ 4. Writing Your First Test

1.  **Create the test file** under `packages/backend/test/...`, mirroring the path in `src/`.

2.  **Name it** with a `.spec.ts` suffix.

3.  **Import** the function or class you want to test.

4.  **Mock** any external modules **before** importing (using `jest.mock()`).


### 4.1 Mocking External Dependencies

We often need to mock:

-   **Prisma client** (`packages/backend/src/prisma/prisma.ts`)

-   **Inquirer** (`inquirer.prompt`)

-   **Argon2** (`argon2.hash`)


#### Prisma mock factory (`test/prisma/prisma.mock.ts`)

```ts
import { Role } from '@prisma/client';

export const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  roleChange: {
    create: jest.fn(),
    deleteMany: jest.fn(),
  },
  promotionToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $disconnect: jest.fn(),
};
```

----------

## 🔨 5. Example: setup-super-admin.logic

### 5.1 Logic: `src/cli/setup-super-admin.logic.ts`

```ts
import { prisma } from '../prisma/prisma';
import { Role } from '@prisma/client';
import inquirer from 'inquirer';
import argon2 from 'argon2';
import type { Answers } from 'inquirer';

export async function setupSuperAdminLogic(
  prompt = inquirer.prompt               // allow injection in tests
): Promise<{ id: string; role: Role }> {
  const existing = await prisma.user.findFirst({
    where: { role: Role.SUPER_ADMIN },
  });
  if (existing) {
    throw new Error('A SUPER_ADMIN already exists.');
  }

  const answers = await prompt([
    { type: 'input',    name: 'email',    message: 'Super Admin email:', validate: v => /\S+@\S+\.\S+/.test(v) },
    { type: 'input',    name: 'name',     message: 'Name:' },
    { type: 'password', name: 'password', message: 'Password:', mask: '*' },
  ]);

  const hash = await argon2.hash(answers.password);
  return prisma.user.create({
    data: {
      email: answers.email,
      name: answers.name,
      password: hash,
      role: Role.SUPER_ADMIN,
    },
  });
}

```

### 5.2 Test: `test/cli/setup-super-admin.logic.spec.ts`

```ts
// 1) Mock BEFORE imports
jest.mock('inquirer', () => ({
  __esModule: true,
  default: { prompt: jest.fn() },
}));
jest.mock('argon2', () => ({
  __esModule: true,
  default: { hash: jest.fn() },
}));
jest.mock('../../src/prisma/prisma', () => ({
  prisma: require('../prisma/prisma.mock').mockPrisma
}));

import inquirer from 'inquirer';
import argon2 from 'argon2';
import { Role } from '@prisma/client';
import { prisma } from '../../src/prisma/prisma';
import { setupSuperAdminLogic } from '../../src/cli/setup-super-admin.logic';

describe('setupSuperAdminLogic()', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a new SUPER_ADMIN when none exists', async () => {
    // Arrange: mock prompt, hash, and Prisma
    (inquirer.prompt as jest.Mock).mockResolvedValue({
      email: 'a@b.com', name: 'Alice', password: 'secret'
    });
    (argon2.hash as jest.Mock).mockResolvedValue('hashed-secret');
    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: '1', role: Role.SUPER_ADMIN });

    // Act
    const user = await setupSuperAdminLogic();

    // Assert
    expect(inquirer.prompt).toHaveBeenCalled();
    expect(argon2.hash).toHaveBeenCalledWith('secret');
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ password: 'hashed-secret' }) })
    );
    expect(user.role).toBe(Role.SUPER_ADMIN);
  });

  it('throws if a SUPER_ADMIN already exists', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: '1', role: Role.SUPER_ADMIN });
    await expect(setupSuperAdminLogic()).rejects.toThrow('A SUPER_ADMIN already exists.');
    expect(inquirer.prompt).not.toHaveBeenCalled();
  });
});
```

----------

## ▶️ 6. Running Your Tests

From the backend package root:

```bash
cd packages/backend
npm run test
```

-   Jest will find **all** `*.spec.ts` files under `test/…`.

-   If you want to run a single test file:

    ```bash
    npm test -- test/cli/setup-super-admin.logic.spec.ts
    ```


----------

## 💡 Tips & Best Practices

-   **Mock early**: call `jest.mock()` before importing the module under test.

-   **Reset mocks** in each `beforeEach` to avoid cross-test pollution.

-   **Inject dependencies** (like `prompt`) where possible to make testing easier.

-   Keep tests **small** and **focused**: one behavior per `it()` block.

-   Use `expect.objectContaining()` to match only relevant parts of large objects.


----------

## 📚 Resources

-   [Jest Docs](https://jestjs.io/docs/getting-started)

-   [ts-jest](https://kulshekhar.github.io/ts-jest/)

-   [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)


----------

Happy testing! 🎉