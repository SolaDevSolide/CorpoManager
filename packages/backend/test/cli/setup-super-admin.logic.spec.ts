// test/cli/setup-super-admin.logic.spec.ts

import inquirer from 'inquirer';
import argon2 from 'argon2';
import { Role } from '@prisma/client';
import { mockPrisma } from '../prisma/prisma.mock';
import { setupSuperAdminLogic } from '../../src/cli/setup-super-admin.logic';
import { prisma } from '../../src/prisma/prisma';

// 1) Provide explicit factories to define these mocks before imports run
jest.mock('inquirer', () => ({
  __esModule: true,
  default: {
    prompt: jest.fn(),
  },
}));
jest.mock('argon2', () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
  },
}));
jest.mock('../../src/prisma/prisma', () => ({
  prisma: mockPrisma,
}));

describe('setupSuperAdminLogic', () => {
  beforeEach(() => {
    // Reset mock state between tests
    jest.clearAllMocks();
  });

  it('creates first SUPER_ADMIN', async () => {
    // a) Cast prompt to a Jest-mocked function so TS knows about mockResolvedValue
    const mockedPrompt = inquirer.prompt as jest.MockedFunction<typeof inquirer.prompt>;
    mockedPrompt.mockResolvedValue({
      email: 'test@x.com',
      name: 'Test User',
      password: 'password123',
    });

    // b) Cast hash to a Jest-mocked function
    const mockedHash = (argon2.hash as jest.MockedFunction<typeof argon2.hash>);
    mockedHash.mockResolvedValue('fake-hash');

    // c) Simulate no SUPER_ADMIN in DB
    mockPrisma.user.findFirst.mockResolvedValue(null);

    // d) Simulate Prisma creating the user
    mockPrisma.user.create.mockResolvedValue({
      id: 'abc123',
      email: 'test@x.com',
      name: 'Test User',
      role: Role.SUPER_ADMIN,
    });

    // e) Run the logic; it will call our mocked prompt and hash
    const user = await setupSuperAdminLogic();

    // f) Verify inquirer.prompt was called once
    expect(mockedPrompt).toHaveBeenCalledTimes(1);

    // g) Verify hash was called with the password
    expect(mockedHash).toHaveBeenCalledWith('password123');

    // h) Verify returned user matches Prisma mock
    expect(user).toEqual(
      expect.objectContaining({
        id: 'abc123',
        role: Role.SUPER_ADMIN,
      })
    );

    // i) Verify create was called with the hashed password
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        email: 'test@x.com',
        name: 'Test User',
        password: 'fake-hash',
        role: Role.SUPER_ADMIN,
      }),
    });
  });

  it('fails if SUPER_ADMIN exists', async () => {
    // a) Simulate an existing SUPER_ADMIN
    mockPrisma.user.findFirst.mockResolvedValue({
      id: 'existing-id',
      role: Role.SUPER_ADMIN,
    });

    // b) Run and expect an immediate error
    await expect(setupSuperAdminLogic()).rejects.toThrow('A SUPER_ADMIN already exists.');

    // c) Ensure neither prompt nor create were called
    expect(inquirer.prompt).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});