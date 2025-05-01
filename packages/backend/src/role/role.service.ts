import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * SUPER_ADMIN only.
   * Issues a one-time token that can be redeemed to promote someone to ADMIN.
   */
  async issuePromotionToken(actorId: string, nextRole: Role): Promise<string> {
    const actor = await this.prisma.user.findUnique({ where: { id: actorId } });
    if (!actor || actor.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can issue promotion tokens');
    }
    if (nextRole !== Role.ADMIN) {
      throw new BadRequestException('Can only issue tokens for ADMIN promotions');
    }

    const token = randomBytes(32).toString('hex');
    await this.prisma.promotionToken.create({
      data: {
        token,
        nextRole,
        createdBy: actorId,
      },
    });
    return token;
  }

  /**
   * Anyone (e.g. via an invitation link) can call this to redeem a promotion token.
   */
  async redeemPromotionToken(token: string, targetId: string): Promise<void> {
    const promo = await this.prisma.promotionToken.findUnique({ where: { token } });
    if (!promo || promo.used) {
      throw new ForbiddenException('Invalid or already-used promotion token');
    }

    const target = await this.prisma.user.findUnique({ where: { id: targetId } });
    if (!target) {
      throw new NotFoundException('Target user not found');
    }

    // Delegate to the common changeUserRole path, using the token creator as “actor”
    await this.changeUserRole(promo.createdBy, targetId, promo.nextRole);

    // Mark token as used
    await this.prisma.promotionToken.update({
      where: { token },
      data: { used: true, usedAt: new Date() },
    });
  }

  /**
   * Shortcut for SUPER_ADMIN → ADMIN
   */
  async promoteToAdmin(actorId: string, targetId: string): Promise<void> {
    return this.changeUserRole(actorId, targetId, Role.ADMIN);
  }

  /**
   * SUPER_ADMIN only.
   * Applies any role change (except SUPER_ADMIN creation/demotion).
   * Audit-logs every change in RoleChange.
   */
  async changeUserRole(actorId: string, targetId: string, nextRole: Role): Promise<void> {
    const actor = await this.prisma.user.findUnique({ where: { id: actorId } });
    if (!actor || actor.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can change user roles');
    }

    const target = await this.prisma.user.findUnique({ where: { id: targetId } });
    if (!target) {
      throw new NotFoundException('Target user not found');
    }

    // Cannot demote an existing SUPER_ADMIN
    if (target.role === Role.SUPER_ADMIN && nextRole !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot demote SUPER_ADMIN');
    }
    // Cannot create a new SUPER_ADMIN at runtime
    if (nextRole === Role.SUPER_ADMIN && target.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('SUPER_ADMIN must be created via CLI');
    }
    // No-op guard
    if (target.role === nextRole) {
      throw new BadRequestException('User already has that role');
    }

    // 1) Update the user’s role
    await this.prisma.user.update({
      where: { id: targetId },
      data: { role: nextRole },
    });

    // 2) Audit-log the change
    await this.prisma.roleChange.create({
      data: {
        userId:    targetId,
        previous:  target.role,
        next:      nextRole,
        changedBy: actorId,
      },
    });
  }
}