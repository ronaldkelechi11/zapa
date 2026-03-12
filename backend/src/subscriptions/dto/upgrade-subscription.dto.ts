import { IsEnum, IsString } from 'class-validator';

export class UpgradeSubscriptionDto {
  @IsEnum(['pro']) // In the future this can expand
  plan: string;

  @IsString()
  paymentToken: string; // e.g., Stripe or Paystack token
}
