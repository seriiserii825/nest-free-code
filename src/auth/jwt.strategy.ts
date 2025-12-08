import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJwtPayload } from './interfaces/IJwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }
  async validate(payload: IJwtPayload) {
    console.log('JWT payload received by JwtStrategy:', payload);
    const id = payload.sub ?? (payload as any).id ?? (payload as any).userId;
    if (!id) {
      console.warn('No id in token payload');
      throw new NotFoundException('User id not present in token payload');
    }
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true },
    });
    console.log('Prisma returned user:', user);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
