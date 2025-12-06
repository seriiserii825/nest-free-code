import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import * as argon from 'argon2';
import { User } from '@prisma/client';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
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

  async signIn(
    dto: SignInDto,
  ): Promise<Pick<User, 'id' | 'email' | 'createdAt'>> {
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
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
  }
}
