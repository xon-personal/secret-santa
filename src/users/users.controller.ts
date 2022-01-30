import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 400, description: 'Invalid format.' })
  @ApiResponse({ status: 201, description: 'Created.' })
  @ApiResponse({ status: 406, description: 'Too much users.' })
  @Post('users')
  create(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returned array of users.',
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get('users')
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get your recipient' })
  @ApiResponse({
    status: 400,
    description: 'Shuffle before getting recipient.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get('users/:id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'Returned affected rows.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Delete('users/:id')
  async remove(@Param('id') id: string): Promise<number | null> {
    const result = await this.usersService.remove(id);
    return result.affected;
  }

  @ApiOperation({ summary: 'Shuffle users' })
  @ApiResponse({ status: 406, description: 'Not enough users.' })
  @ApiResponse({ status: 406, description: 'Users already shuffled.' })
  @Post('shuffle')
  async shuffle(): Promise<void> {
    return this.usersService.shuffle();
  }
}
