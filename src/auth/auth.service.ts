import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  signUp() {
    return { message: 'User signed up successfully' };
  }

  signIn() {
    return { message: 'User signed in successfully' };
  }
}
