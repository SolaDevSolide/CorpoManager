import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { JwtPayload } from '../../src/auth/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prisma: Partial<PrismaService>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      } as Partial<Prisma.UserDelegate>,
    } as Partial<PrismaService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: { get: () => 'secret' } },
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    strategy = module.get(JwtStrategy);
  });

  it('validates and returns payload for active user', async () => {
    const payload: JwtPayload = { sub: 'uid', email: 'e', role: 'USER' };
    (prisma.user!.findUnique as jest.Mock).mockResolvedValue({
      id: 'uid', email: 'e', role: 'USER', isActive: true,
    });

    const user = await strategy.validate(payload);
    expect(user).toEqual(payload);
  });

  it('throws if user not found', async () => {
    (prisma.user!.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(strategy.validate({ sub: 'x', email: '', role: 'USER' }))
      .rejects.toThrow(UnauthorizedException);
  });

  it('throws if user inactive', async () => {
    (prisma.user!.findUnique as jest.Mock).mockResolvedValue({
      id: 'x', email: 'e', role: 'USER', isActive: false,
    });
    await expect(strategy.validate({ sub: 'x', email: '', role: 'USER' }))
      .rejects.toThrow(UnauthorizedException);
  });
});