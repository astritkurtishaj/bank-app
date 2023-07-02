import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class WithdrawalAndDepositTransactionDto {
  @ApiProperty({
    description: 'Amount you want to deposit/withdraw',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
