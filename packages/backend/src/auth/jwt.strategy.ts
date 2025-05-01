import { PassportStrategy }            from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { ConfigService }               from '@nestjs/config';
import { PrismaService }               from '../prisma/prisma.service';
import { JwtPayload }                  from './jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // 1) Fetch the secret and crash early if it's not set
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('FATAL: JWT_SECRET environment variable is not defined');
    }

    // 2) Build a properly typed options object
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    };

    // 3) Pass those options into the base Passport Strategy
    super(options);
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where:  { id: payload.sub },
      select: { id: true, email: true, role: true, isActive: true },
    });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Inactive or missing user');
    }

    // Return exactly the JwtPayload shape
    return {
      sub:   user.id,
      email: user.email,
      role:  user.role,
    };
  }
}