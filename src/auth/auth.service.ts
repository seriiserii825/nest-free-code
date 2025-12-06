import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import * as argon from 'argon2';
import {User} from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signUp(dto: SignUpDto): Promise<Pick<User, 'id' | 'email' | 'createdAt'>> {
    const existing_user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing_user) {
      throw new ForbiddenException('Credentials taken');
    }
    const hash = await argon.hash(dto.password);
    const user =await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      }
    })
    return user;
  }

  signIn() {
    return { message: 'User signed in successfully' };
  }
}
