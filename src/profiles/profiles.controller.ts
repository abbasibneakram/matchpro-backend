import {
  Body, Controller, Get, Param, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentMatchmaker } from '../common/decorators/current-matchmaker.decorator';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Post()
  create(@CurrentMatchmaker() mm: { id: string }, @Body() dto: CreateProfileDto) {
    return this.profilesService.create(mm.id, dto);
  }

  @Get()
  findAll(@CurrentMatchmaker() mm: { id: string }, @Query('status') status?: string) {
    return this.profilesService.findAll(mm.id, status);
  }

  @Get(':id')
  findOne(@CurrentMatchmaker() mm: { id: string }, @Param('id') id: string) {
    return this.profilesService.findOne(mm.id, id);
  }

  @Patch(':id')
  update(
    @CurrentMatchmaker() mm: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.update(mm.id, id, dto);
  }

  @Patch(':id/payment')
  updatePayment(
    @CurrentMatchmaker() mm: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.profilesService.updatePayment(mm.id, id, dto);
  }
}
