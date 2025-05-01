import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [RoleService, PrismaService],
  exports:    [RoleService],
})
export class RoleModule {}
