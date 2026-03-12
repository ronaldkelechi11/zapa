import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { BusinessService } from '../business/business.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    private readonly businessService: BusinessService,
    private readonly customersService: CustomersService,
  ) {}

  async create(userId: string, createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    // Validate that the business and customer belong to the user
    await this.businessService.findOne(userId, createInvoiceDto.businessId);
    await this.customersService.findOne(userId, createInvoiceDto.customerId);

    const createdInvoice = new this.invoiceModel({
      ...createInvoiceDto,
      userId,
    });
    return createdInvoice.save();
  }

  async findAllForUser(userId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ userId }).exec();
  }

  async findOne(userId: string, invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ _id: invoiceId, userId }).exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice #${invoiceId} not found or access denied`);
    }
    return invoice;
  }

  async update(userId: string, invoiceId: string, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    // Optional validations if businessId or customerId are being updated
    if (updateInvoiceDto.businessId) {
      await this.businessService.findOne(userId, updateInvoiceDto.businessId);
    }
    if (updateInvoiceDto.customerId) {
      await this.customersService.findOne(userId, updateInvoiceDto.customerId);
    }

    const updatedInvoice = await this.invoiceModel
      .findOneAndUpdate({ _id: invoiceId, userId }, updateInvoiceDto, { new: true })
      .exec();

    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice #${invoiceId} not found or access denied`);
    }
    return updatedInvoice;
  }

  async remove(userId: string, invoiceId: string): Promise<any> {
    const result = await this.invoiceModel.deleteOne({ _id: invoiceId, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Invoice #${invoiceId} not found or access denied`);
    }
    return result;
  }

  async markAsPaid(userId: string, invoiceId: string): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel
      .findOneAndUpdate({ _id: invoiceId, userId }, { status: 'paid' }, { new: true })
      .exec();

    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice #${invoiceId} not found or access denied`);
    }
    return updatedInvoice;
  }
}
