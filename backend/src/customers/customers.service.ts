import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BusinessService } from '../business/business.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    private readonly businessService: BusinessService,
  ) {}

  async create(userId: string, createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Validate that the business belongs to the user
    await this.businessService.findOne(userId, createCustomerDto.businessId);

    const createdCustomer = new this.customerModel({
      ...createCustomerDto,
      userId,
    });
    return createdCustomer.save();
  }

  async findAllForUser(userId: string): Promise<Customer[]> {
    return this.customerModel.find({ userId }).exec();
  }

  async findOne(userId: string, customerId: string): Promise<Customer> {
    const customer = await this.customerModel.findOne({ _id: customerId, userId }).exec();
    if (!customer) {
      throw new NotFoundException(`Customer #${customerId} not found or access denied`);
    }
    return customer;
  }

  async update(userId: string, customerId: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const updatedCustomer = await this.customerModel
      .findOneAndUpdate({ _id: customerId, userId }, updateCustomerDto, { new: true })
      .exec();

    if (!updatedCustomer) {
      throw new NotFoundException(`Customer #${customerId} not found or access denied`);
    }
    return updatedCustomer;
  }

  async remove(userId: string, customerId: string): Promise<any> {
    const result = await this.customerModel.deleteOne({ _id: customerId, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Customer #${customerId} not found or access denied`);
    }
    return result;
  }
}
