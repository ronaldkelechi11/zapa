import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from './business.schema';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>,
  ) {}

  async create(userId: string, createBusinessDto: CreateBusinessDto): Promise<Business> {
    const createdBusiness = new this.businessModel({
      ...createBusinessDto,
      userId,
    });
    return createdBusiness.save();
  }

  async findAllForUser(userId: string): Promise<Business[]> {
    return this.businessModel.find({ userId }).exec();
  }

  async findOne(userId: string, businessId: string): Promise<Business> {
    const business = await this.businessModel.findOne({ _id: businessId, userId }).exec();
    if (!business) {
      throw new NotFoundException(`Business #${businessId} not found or access denied`);
    }
    return business;
  }

  async update(userId: string, businessId: string, updateBusinessDto: UpdateBusinessDto): Promise<Business> {
    const updatedBusiness = await this.businessModel
      .findOneAndUpdate({ _id: businessId, userId }, updateBusinessDto, { new: true })
      .exec();

    if (!updatedBusiness) {
      throw new NotFoundException(`Business #${businessId} not found or access denied`);
    }
    return updatedBusiness;
  }

  async remove(userId: string, businessId: string): Promise<any> {
    const result = await this.businessModel.deleteOne({ _id: businessId, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Business #${businessId} not found or access denied`);
    }
    return result;
  }
}
