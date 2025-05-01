import { JwtService }        from '@nestjs/jwt';
import { PrismaService }     from '../prisma/prisma.service';
import { JwtPayload }        from './jwt-payload.interface';
import * as argon2           from 'argon2';
import { Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt:    JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, role: true, isActive: true },
    });

    // not found or inactive
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // verify Argon2 hash
    const matches = await argon2.verify(user.password, pass);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // strip the password before returning
    const { password, ...safe } = user;
    return safe;
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload: JwtPayload = {
      sub:   user.id,
      email: user.email,
      role:  user.role as any,
    };
    const accessToken = this.jwt.sign(payload);
    return {
      accessToken,
      expiresIn: this.jwt.decode(accessToken)['exp'],
    };
  }
}