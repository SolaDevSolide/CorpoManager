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