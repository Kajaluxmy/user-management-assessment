import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch('me')
  updateMe(
    @Req() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(
      req.user.userId,
      updateUserDto,
    );
  }

  @Delete('me')
  deleteMe(@Req() req: any) {
    return this.usersService.delete(
      req.user.userId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}