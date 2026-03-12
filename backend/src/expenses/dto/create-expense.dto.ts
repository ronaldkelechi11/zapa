import { IsString, IsNumber, IsMongoId, IsDateString, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @IsMongoId()
  businessId: string;

  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  receiptImage?: string;
}
