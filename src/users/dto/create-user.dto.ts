import {
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString({ message: 'Name must be string value' })
  @IsNotEmpty({ message: 'Name has not declared' })
  name: string;

  @ApiProperty()
  @IsString({ message: 'Surname must be string value' })
  @IsNotEmpty({ message: 'Surname has not declared' })
  surname: string;

  @ApiProperty()
  @IsArray({ message: 'Wishes must be array' })
  @IsNotEmpty({ message: 'Wishes has not declared' })
  @ArrayMaxSize(10, {
    message: 'Count of wishes must be between 1 and 10',
  })
  @ArrayMinSize(1, {
    message: 'Count of wishes must be between 1 and 10',
  })
  wishes: string[];
}
