import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@UseGuards(FirebaseAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() createExpenseDto: CreateExpenseDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.expensesService.create(user._id.toString(), createExpenseDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.expensesService.findAllForUser(user._id.toString());
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.expensesService.remove(user._id.toString(), id);
  }
}
