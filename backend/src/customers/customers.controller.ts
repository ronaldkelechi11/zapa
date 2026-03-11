import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@UseGuards(FirebaseAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() createCustomerDto: CreateCustomerDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.customersService.create(user._id.toString(), createCustomerDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.customersService.findAllForUser(user._id.toString());
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.customersService.findOne(user._id.toString(), id);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.customersService.update(user._id.toString(), id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.customersService.remove(user._id.toString(), id);
  }
}
