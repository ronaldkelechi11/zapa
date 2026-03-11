import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { UsersService } from '../users/users.service';

@UseGuards(FirebaseAuthGuard)
@Controller('business')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Req() req: any, @Body() createBusinessDto: CreateBusinessDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.businessService.create(user._id.toString(), createBusinessDto);
  }

  @Get()
  async findAll(@Req() req: any) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.businessService.findAllForUser(user._id.toString());
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.businessService.findOne(user._id.toString(), id);
  }

  @Patch(':id')
  async update(@Req() req: any, @Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.businessService.update(user._id.toString(), id, updateBusinessDto);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    const user = await this.usersService.findByFirebaseUid(req.user.uid);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.businessService.remove(user._id.toString(), id);
  }
}
