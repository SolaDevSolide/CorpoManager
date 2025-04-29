import { Module, Global } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (): Promise<RedisClient> => {
        const client = new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD,
          maxRetriesPerRequest: 5,
          reconnectOnError: (err) => err.message.includes('ECONNREFUSED'),
          retryStrategy: (times) => Math.min(times * 100, 2000),
        });

        await client.ping(); // fail early if not available
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
