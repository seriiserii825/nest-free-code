import { Injectable } from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {SignUpDto} from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signUp(dto: SignUpDto) {
    return dto;
    // const users = this.prisma.user.findMany();
    return { message: 'User signed up successfully' };
  }

  signIn() {
    return { message: 'User signed in successfully' };
  }
}
