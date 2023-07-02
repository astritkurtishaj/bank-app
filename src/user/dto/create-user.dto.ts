import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'first_name', example: 'test' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ description: 'last_name', example: 'test' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'password', example: 'test' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'email', example: 'test@test.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
