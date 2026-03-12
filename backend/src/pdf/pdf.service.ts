import { Injectable, NotFoundException } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { InvoicesService } from '../invoices/invoices.service';
import { BusinessService } from '../business/business.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class PdfService {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly businessService: BusinessService,
    private readonly customersService: CustomersService,
  ) {}

  async generateInvoicePdf(userId: string, invoiceId: string): Promise<Buffer> {
    const invoice = await this.invoicesService.findOne(userId, invoiceId);
    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const business = await this.businessService.findOne(userId, invoice.businessId.toString());
    const customer = await this.customersService.findOne(userId, invoice.customerId.toString());

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // --- PDF Header ---
      doc.fontSize(20).text('INVOICE', { align: 'right' });
      doc.moveDown();

      // Business Details
      doc.fontSize(14).text(business.name);
      doc.fontSize(10).text(business.email || '');
      doc.text(business.phone || '');
      doc.text(business.address || '');

      doc.moveDown();

      // Customer Details
      doc.fontSize(12).text('Billed To:');
      doc.fontSize(10).text(customer.name);
      doc.text(customer.email || '');
      doc.text(customer.phone || '');
      doc.text(customer.address || '');

      doc.moveDown();

      // Invoice Info
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
      doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
      doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);
      doc.text(`Status: ${invoice.status.toUpperCase()}`);

      doc.moveDown(2);

      // --- Table Headers ---
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Item', 50, tableTop);
      doc.text('Qty', 300, tableTop, { width: 50, align: 'right' });
      doc.text('Price', 350, tableTop, { width: 70, align: 'right' });
      doc.text('Total', 420, tableTop, { width: 80, align: 'right' });

      doc.moveTo(50, doc.y + 5).lineTo(500, doc.y + 5).stroke();
      doc.font('Helvetica');

      // --- Table Rows ---
      let currentY = doc.y + 15;
      invoice.items.forEach((item) => {
        doc.text(item.name, 50, currentY);
        doc.text(item.quantity.toString(), 300, currentY, { width: 50, align: 'right' });
        doc.text(item.price.toFixed(2), 350, currentY, { width: 70, align: 'right' });
        doc.text(item.total.toFixed(2), 420, currentY, { width: 80, align: 'right' });
        currentY += 20;
      });

      doc.moveTo(50, currentY).lineTo(500, currentY).stroke();

      // --- Totals ---
      currentY += 15;
      doc.font('Helvetica-Bold');
      doc.text('Subtotal:', 350, currentY, { width: 70, align: 'right' });
      doc.text(invoice.subtotal.toFixed(2), 420, currentY, { width: 80, align: 'right' });

      currentY += 15;
      doc.text('Tax:', 350, currentY, { width: 70, align: 'right' });
      doc.text(invoice.tax.toFixed(2), 420, currentY, { width: 80, align: 'right' });

      if (invoice.discount > 0) {
        currentY += 15;
        doc.text('Discount:', 350, currentY, { width: 70, align: 'right' });
        doc.text(`-${invoice.discount.toFixed(2)}`, 420, currentY, { width: 80, align: 'right' });
      }

      currentY += 20;
      doc.fontSize(14).text('Total:', 350, currentY, { width: 70, align: 'right' });
      doc.text(`${business.currency} ${invoice.total.toFixed(2)}`, 420, currentY, { width: 80, align: 'right' });

      if (invoice.notes) {
        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica').text('Notes:');
        doc.text(invoice.notes);
      }

      doc.end();
    });
  }
}
