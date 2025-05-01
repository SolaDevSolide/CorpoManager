import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: Partial<PrismaService>;
  let jwt: Partial<JwtService>;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      } as Partial<Prisma.UserDelegate>,
    } as Partial<PrismaService>;
    jwt = {
      sign: jest.fn().mockReturnValue('signed-token'),
      decode: jest.fn().mockReturnValue({ exp: 12345 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('validateUser', () => {
    it('throws if user not found', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.validateUser('x@x.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('throws if password mismatch', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValue({
        id: '1', email: 'x@x.com', password: 'hash', role: 'USER', isActive: true,
      });
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);
      await expect(service.validateUser('x@x.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('returns user data on success', async () => {
      (prisma.user!.findUnique as jest.Mock).mockResolvedValue({
        id: '1', email: 'x@x.com', password: 'hash', role: 'ADMIN', isActive: true,
      });
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);

      const result = await service.validateUser('x@x.com', 'pass');
      expect(result).toEqual({ id: '1', email: 'x@x.com', role: 'ADMIN', isActive: true });
    });
  });

  describe('login', () => {
    it('signs and returns token + expiry', async () => {
      const user = { id: '1', email: 'a@b', role: 'USER' };
      const out = await service.login(user);
      expect(jwt.sign).toHaveBeenCalledWith({ sub: '1', email: 'a@b', role: 'USER' });
      expect(out).toEqual({ accessToken: 'signed-token', expiresIn: 12345 });
    });
  });
});