import { RolesGuard } from '../../src/auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let prisma: Partial<PrismaService>;

  const mockContext = (roleMeta?: string[], userRole?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({ user: { role: userRole } }),
    }),
    getHandler: () => {},
  } as any);

  beforeEach(() => {
    reflector = new Reflector();
    prisma = {} as any;
    guard = new RolesGuard(reflector, prisma as PrismaService);
  });

  it('allows when no metadata', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    await expect(guard.canActivate(mockContext(undefined, 'USER'))).resolves.toBe(true);
  });

  it('allows when user has required role', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['ADMIN']);
    await expect(guard.canActivate(mockContext(['ADMIN'], 'ADMIN'))).resolves.toBe(true);
  });

  it('throws when user lacks role', async () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['ADMIN']);
    await expect(guard.canActivate(mockContext(['ADMIN'], 'USER')))
      .rejects.toThrow(ForbiddenException);
  });
});