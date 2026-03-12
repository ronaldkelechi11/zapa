import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { BusinessModule } from '../business/business.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    InvoicesModule,
    BusinessModule,
    CustomersModule,
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
