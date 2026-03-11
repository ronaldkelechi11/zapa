import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ['free', 'pro'], default: 'free' })
  plan: string;

  @Prop({ enum: ['active', 'canceled', 'past_due'], default: 'active' })
  status: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  renewalDate: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
