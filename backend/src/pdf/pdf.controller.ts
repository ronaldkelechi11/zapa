import { Controller, Get, Param, Res, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@UseGuards(FirebaseAuthGuard)
@Controller('invoices')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly usersService: UsersService,
  ) {}

  @Get(':id/pdf')
  async getInvoicePdf(@Req() req: any, @Param('id') invoiceId: string, @Res() res: Response) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const pdfBuffer = await this.pdfService.generateInvoicePdf(user._id.toString(), invoiceId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice-${invoiceId}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Failed to generate PDF' });
      }
    }
  }
}
