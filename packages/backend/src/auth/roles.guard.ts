import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user; // assumed populated by your JwtStrategy

    // Example: metadata on handler: ['ADMIN'], etc.
    const required = this.reflector.get<Role[]>('roles', ctx.getHandler());
    if (!required) return true;

    if (!required.includes(user.role as Role)) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}
