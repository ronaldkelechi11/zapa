import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@UseGuards(FirebaseAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() createInvoiceDto: CreateInvoiceDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.invoicesService.create(user._id.toString(), createInvoiceDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.invoicesService.findAllForUser(user._id.toString());
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.invoicesService.findOne(user._id.toString(), id);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.invoicesService.update(user._id.toString(), id, updateInvoiceDto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.invoicesService.remove(user._id.toString(), id);
  }

  @Post(':id/mark-paid')
  async markAsPaid(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.invoicesService.markAsPaid(user._id.toString(), id);
  }
}
