import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from './subscription.schema';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    private readonly usersService: UsersService,
  ) {}

  async getSubscription(userId: string): Promise<Subscription> {
    const sub = await this.subscriptionModel.findOne({ userId }).exec();
    if (!sub) {
      // Return a default "free" representation if no DB record exists yet
      return {
        userId: userId as any,
        plan: 'free',
        status: 'active',
        startDate: new Date(),
        renewalDate: null,
      } as any;
    }
    return sub;
  }

  async upgrade(userId: string, upgradeDto: UpgradeSubscriptionDto): Promise<Subscription> {
    // In a real app, integrate Stripe or Paystack here using upgradeDto.paymentToken
    // For MVP, we will mock the upgrade process.

    const newRenewalDate = new Date();
    newRenewalDate.setMonth(newRenewalDate.getMonth() + 1); // 1 month from now

    let sub = await this.subscriptionModel.findOne({ userId }).exec();

    if (sub) {
      if (sub.plan === 'pro' && sub.status === 'active') {
        throw new BadRequestException('User is already on a Pro plan');
      }
      sub.plan = 'pro';
      sub.status = 'active';
      sub.renewalDate = newRenewalDate;
      await sub.save();
    } else {
      sub = new this.subscriptionModel({
        userId,
        plan: 'pro',
        status: 'active',
        startDate: new Date(),
        renewalDate: newRenewalDate,
      });
      await sub.save();
    }

    // Also update the User profile to reflect the pro plan
    await this.usersService.update(userId, { plan: 'pro' });

    return sub;
  }

  async cancel(userId: string): Promise<Subscription> {
    const sub = await this.subscriptionModel.findOne({ userId }).exec();
    if (!sub) {
      throw new NotFoundException('No active subscription found');
    }

    // In a real app, call Stripe/Paystack to cancel the recurring billing
    sub.status = 'canceled';
    await sub.save();

    // Downgrade user back to free immediately or at the end of billing cycle
    await this.usersService.update(userId, { plan: 'free' });

    return sub;
  }
}
