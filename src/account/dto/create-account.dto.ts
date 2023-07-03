import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ description: 'User email', example: 'test@test.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
