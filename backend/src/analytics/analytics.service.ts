import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from '../invoices/invoice.schema';
import { Customer, CustomerDocument } from '../customers/customer.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  async getDashboardData(userId: string) {
    const invoices = await this.invoiceModel.find({ userId }).exec();

    let totalRevenue = 0;
    let paidInvoices = 0;
    let pendingInvoices = 0;

    for (const inv of invoices) {
      if (inv.status === 'paid') {
        totalRevenue += inv.total;
        paidInvoices++;
      } else if (inv.status === 'sent' || inv.status === 'overdue' || inv.status === 'draft') {
        pendingInvoices++;
      }
    }

    const totalInvoices = invoices.length;

    // A simplified example for monthly revenue
    // In production, this would use MongoDB aggregation framework for performance
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = invoices
      .filter((inv) => inv.issueDate.getMonth() === currentMonth && inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRevenue,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      monthlyRevenue: [monthlyRevenue], // Mock array representing current month
      topCustomers: [], // Would use an aggregate query joining invoices and customers
    };
  }
}
