import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'firstName', example: 'test' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'lastName', example: 'test' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

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
