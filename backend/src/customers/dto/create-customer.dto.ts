import { IsString, IsOptional, IsEmail, IsMongoId } from 'class-validator';

export class CreateCustomerDto {
  @IsMongoId()
  businessId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
