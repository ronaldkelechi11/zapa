import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await this.authService.verifyToken(token);
      request.user = decodedToken; // Attach decoded token to request for future use in controllers
      return true;
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate token', error.message);
    }
  }
}
