import { Test, TestingModule } from '@nestjs/testing';
import { RoleService } from '../../src/role/role.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as crypto from 'crypto';

describe('RoleService', () => {
  let svc: RoleService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      promotionToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      roleChange: { create: jest.fn() },
    };

    const mod: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    svc = mod.get(RoleService);
  });

  describe('issuePromotionToken', () => {
    it('throws if not SUPER_ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue({ role: Role.ADMIN });
      await expect(svc.issuePromotionToken('actor', Role.ADMIN))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws if nextRole ≠ ADMIN', async () => {
      prisma.user.findUnique.mockResolvedValue({ role: Role.SUPER_ADMIN });
      await expect(svc.issuePromotionToken('actor', Role.USER))
        .rejects.toThrow(BadRequestException);
    });

    it('creates token on success', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ id: 'creator', role: Role.SUPER_ADMIN }) // from token
        .mockResolvedValueOnce({ id: 'u1', role: Role.USER });            // actual target
      jest
        .spyOn(crypto, 'randomBytes')
        .mockImplementation((size: number) => {
          // ignore `size`, always return our chosen Buffer
          return Buffer.from('abcd', 'hex');
        });
      prisma.promotionToken.create.mockResolvedValue({ token: 'abcd', nextRole: Role.ADMIN });

      const token = await svc.issuePromotionToken('actor', Role.ADMIN);
      expect(token).toBe('abcd');
      expect(prisma.promotionToken.create).toHaveBeenCalledWith(expect.objectContaining({
        data: { token: expect.any(String), nextRole: Role.ADMIN, createdBy: 'actor' },
      }));
    });
  });

  describe('changeUserRole', () => {
    beforeEach(() => {
      prisma.user.findUnique.mockResolvedValue({ id: 'u1', role: Role.USER, isActive: true });
    });

    it('throws if actor not SUPER_ADMIN', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ role: Role.ADMIN })  // actor
        .mockResolvedValueOnce({ id: 'u1', role: Role.USER }); // target
      await expect(svc.changeUserRole('act', 'u1', Role.ADMIN))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws if target missing', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ role: Role.SUPER_ADMIN }); // actor
      prisma.user.findUnique.mockResolvedValueOnce(null); // target
      await expect(svc.changeUserRole('act', 'uX', Role.ADMIN))
        .rejects.toThrow(NotFoundException);
    });

    it('prevents demoting SUPER_ADMIN', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ role: Role.SUPER_ADMIN }) // actor
        .mockResolvedValueOnce({ id: 't', role: Role.SUPER_ADMIN }); // target
      await expect(svc.changeUserRole('a', 't', Role.USER))
        .rejects.toThrow(ForbiddenException);
    });

    it('prevents creating new SUPER_ADMIN', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ role: Role.SUPER_ADMIN }) // actor
        .mockResolvedValueOnce({ id: 't', role: Role.USER }); // target
      await expect(svc.changeUserRole('a', 't', Role.SUPER_ADMIN))
        .rejects.toThrow(ForbiddenException);
    });

    it('prevents no-op', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ role: Role.SUPER_ADMIN }) // actor
        .mockResolvedValueOnce({ id: 't', role: Role.USER }); // target
      await expect(svc.changeUserRole('a', 't', Role.USER))
        .rejects.toThrow(BadRequestException);
    });

    it('updates and logs on success', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce({ role: Role.SUPER_ADMIN }) // actor
        .mockResolvedValueOnce({ id: 't', role: Role.USER }); // target

      await svc.changeUserRole('a', 't', Role.ADMIN);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 't' },
        data: { role: Role.ADMIN },
      });
      expect(prisma.roleChange.create).toHaveBeenCalledWith({
        data: { userId: 't', previous: Role.USER, next: Role.ADMIN, changedBy: 'a' },
      });
    });
  });

  describe('redeemPromotionToken', () => {
    it('throws on invalid token', async () => {
      prisma.promotionToken.findUnique.mockResolvedValue(null);
      await expect(svc.redeemPromotionToken('nope', 'u1'))
        .rejects.toThrow(ForbiddenException);
    });

    it('throws on used token', async () => {
      prisma.promotionToken.findUnique.mockResolvedValue({ used: true });
      await expect(svc.redeemPromotionToken('tok', 'u1'))
        .rejects.toThrow(ForbiddenException);
    });

    it('redeems and marks used', async () => {
      prisma.promotionToken.findUnique.mockResolvedValue({
        used: false,
        nextRole: Role.ADMIN,
        createdBy: 'creator-id',
        token: 'tok',
      });

      prisma.user.findUnique
        .mockResolvedValueOnce({ id: 'creator-id', role: Role.SUPER_ADMIN }) // actor
        .mockResolvedValueOnce({ id: 'u1', role: Role.USER });               // target

      jest.spyOn(svc, 'changeUserRole').mockResolvedValue(undefined);
      prisma.promotionToken.update.mockResolvedValue({ used: true, usedAt: new Date() });

      await svc.redeemPromotionToken('tok', 'u1');

      expect(svc.changeUserRole).toHaveBeenCalledWith('creator-id', 'u1', Role.ADMIN);
      expect(prisma.promotionToken.update).toHaveBeenCalledWith({
        where: { token: 'tok' },
        data: { used: true, usedAt: expect.any(Date) },
      });
    });
  });
});