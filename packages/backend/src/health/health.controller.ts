import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import type { Redis as RedisClient } from 'ioredis';

@Controller('health')
export class HealthController {
    constructor(
      private readonly prisma: PrismaService,
      @Inject('REDIS_CLIENT') private readonly redis: RedisClient,
    ) {}

    @Get()
    async check(@Req() req: Request) {
        const ip = req.ip ?? ''; // Fallback to empty string

        // Allow 127.0.0.1, ::1 (IPv6 localhost), or Docker NATed local IP
        if (
          !['127.0.0.1', '::1'].includes(ip) &&
          !ip?.startsWith('::ffff:127.')  // Docker bridge local
        ) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }

        // Check Postgres
        try {
            await this.prisma.$queryRaw`SELECT 1`;
        } catch {
            throw new HttpException(
              { status: 'error', detail: 'Postgres unreachable' },
              HttpStatus.SERVICE_UNAVAILABLE,
            );
        }

        // Check Redis
        let redisInfo: Record<string, any> = {};
        try {
            const infoRaw = await this.redis.info();
            redisInfo = parseRedisInfo(infoRaw);
        } catch {
            throw new HttpException(
              { status: 'error', detail: 'Redis unreachable' },
              HttpStatus.SERVICE_UNAVAILABLE,
            );
        }

        return {
            status: 'ok',
            redis: {
                uptime: `${redisInfo.uptime_in_seconds}s`,
                memory_used: redisInfo.used_memory,
                connected_clients: redisInfo.connected_clients,
            },
        };
    }
}

// Helper to parse Redis INFO into a usable object
function parseRedisInfo(info: string): Record<string, string> {
    return info
      .split('\n')
      .filter(line => line.includes(':'))
      .reduce((acc, line) => {
          const [key, val] = line.split(':');
          acc[key] = val.trim();
          return acc;
      }, {} as Record<string, string>);
}
