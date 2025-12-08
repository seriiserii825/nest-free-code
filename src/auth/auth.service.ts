import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/IJwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(
    dto: SignUpDto,
  ): Promise<Pick<User, 'id' | 'email' | 'createdAt'>> {
    const existing_user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing_user) {
      throw new ForbiddenException('Credentials taken');
    }
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    return user;
  }

  async signIn(dto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const password_matches = await argon.verify(user.hash, dto.password);
    if (!password_matches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    return {
      access_token: await this.signToken(user.id, user.email),
    };
  }

  async signToken(user_id: number, email: string): Promise<string> {
    const payload: IJwtPayload = {
      sub: user_id,
      email,
    };

    try {
      const token = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      });
      return token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ForbiddenException(`Token signing failed: ${error.message}`);
      }
      throw new ForbiddenException('Token signing failed');
    }
  }
}
