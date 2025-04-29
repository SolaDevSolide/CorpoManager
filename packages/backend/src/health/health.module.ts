import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [RedisModule, PrismaModule],
    controllers: [HealthController],
})
export class HealthModule {}
