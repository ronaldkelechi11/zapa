import { Controller, Get, Post, Body, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@UseGuards(FirebaseAuthGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getSubscription(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.subscriptionsService.getSubscription(user._id.toString());
  }

  @Post('upgrade')
  async upgrade(@Req() req: any, @Body() upgradeDto: UpgradeSubscriptionDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.subscriptionsService.upgrade(user._id.toString(), upgradeDto);
  }

  @Post('cancel')
  async cancel(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.subscriptionsService.cancel(user._id.toString());
  }
}
