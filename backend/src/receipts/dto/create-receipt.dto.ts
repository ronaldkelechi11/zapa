import { IsString, IsNumber, IsMongoId, IsDateString } from 'class-validator';

export class CreateReceiptDto {
  @IsMongoId()
  invoiceId: string;

  @IsString()
  receiptNumber: string;

  @IsNumber()
  amount: number;

  @IsString()
  paymentMethod: string;

  @IsDateString()
  date: string;
}
