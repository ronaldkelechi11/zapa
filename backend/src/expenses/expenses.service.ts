import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Expense, ExpenseDocument } from './expense.schema';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { BusinessService } from '../business/business.service';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    private readonly businessService: BusinessService,
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto): Promise<Expense> {
    // Validate that the business belongs to the user
    await this.businessService.findOne(userId, createExpenseDto.businessId);

    const createdExpense = new this.expenseModel({
      ...createExpenseDto,
      userId,
    });
    return createdExpense.save();
  }

  async findAllForUser(userId: string): Promise<Expense[]> {
    return this.expenseModel.find({ userId }).exec();
  }

  async remove(userId: string, expenseId: string): Promise<any> {
    const result = await this.expenseModel.deleteOne({ _id: expenseId, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Expense #${expenseId} not found or access denied`);
    }
    return result;
  }
}
