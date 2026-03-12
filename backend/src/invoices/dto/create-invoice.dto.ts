import { IsString, IsNumber, IsOptional, IsMongoId, IsDateString, IsEnum, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceItemDto {
  @IsString()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsNumber()
  total: number;
}

export class CreateInvoiceDto {
  @IsMongoId()
  businessId: string;

  @IsMongoId()
  customerId: string;

  @IsString()
  invoiceNumber: string;

  @IsDateString()
  issueDate: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsEnum(['draft', 'sent', 'paid', 'overdue'])
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  discount: number;

  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
