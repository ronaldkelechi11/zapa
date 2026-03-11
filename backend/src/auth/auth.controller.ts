import { Controller, Post, Get, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new HttpException('Missing or invalid Authorization header', HttpStatus.UNAUTHORIZED);
    }
    const token = authHeader.split(' ')[1];
    return this.authService.verifyAndCreateUser(token);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    // req.user is set by FirebaseAuthGuard
    return req.user;
  }
}
