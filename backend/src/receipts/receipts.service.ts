import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Receipt, ReceiptDocument } from './receipt.schema';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class ReceiptsService {
  constructor(
    @InjectModel(Receipt.name) private receiptModel: Model<ReceiptDocument>,
    private readonly invoicesService: InvoicesService,
  ) {}

  async create(userId: string, createReceiptDto: CreateReceiptDto): Promise<Receipt> {
    // Validate that the invoice belongs to the user
    await this.invoicesService.findOne(userId, createReceiptDto.invoiceId);

    const createdReceipt = new this.receiptModel({
      ...createReceiptDto,
      userId,
    });
    return createdReceipt.save();
  }

  async findAllForUser(userId: string): Promise<Receipt[]> {
    return this.receiptModel.find({ userId }).exec();
  }

  async findOne(userId: string, receiptId: string): Promise<Receipt> {
    const receipt = await this.receiptModel.findOne({ _id: receiptId, userId }).exec();
    if (!receipt) {
      throw new NotFoundException(`Receipt #${receiptId} not found or access denied`);
    }
    return receipt;
  }
}
