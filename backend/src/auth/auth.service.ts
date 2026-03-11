import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async verifyToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase Token', error.message);
    }
  }

  async verifyAndCreateUser(idToken: string) {
    const decodedToken = await this.verifyToken(idToken);
    const { uid, email, name } = decodedToken;

    let user = await this.usersService.findByFirebaseUid(uid);

    if (!user) {
      user = await this.usersService.create({
        firebaseUid: uid,
        email: email || '', // Firebase might return undefined if no email
        name: name || '',
        plan: 'free',
      });
    }

    return user;
  }
}
