import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
  @Get('users')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('users/:id')
  findOne(@Param('id') id: string): Promise<object> {
    return this.usersService.findOne(id);
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string): Promise<number | null> {
    const result = await this.usersService.remove(id);
    return result.affected;
  }
  @Post('shuffle')
  async shuffle(): Promise<number> {
    return this.usersService.shuffle();
  }
}
