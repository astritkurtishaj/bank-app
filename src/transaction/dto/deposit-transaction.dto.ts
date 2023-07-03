import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class DepositTransactionDto {
  @ApiProperty({
    description: 'Amount you want to deposit/withdraw',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Receiver Account Number',
    example: '679307',
  })
  @IsNotEmpty()
  @IsString()
  receiverAccount: string;
}
