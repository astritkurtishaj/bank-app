import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { WithdrawalAndDepositTransactionDto } from './dto/withdraw-deposit-transaction.dto';
import { Request } from 'express';
import { JwtGuard } from 'src/guards';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeaders,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOkResponse({ description: 'Deposit successful' })
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  @ApiBearerAuth()
  @Post('deposit')
  async deposit(
    @Body() depositTransactionDto: WithdrawalAndDepositTransactionDto,
    @Req() request: Request,
  ) {
    return await this.transactionService.deposit(
      depositTransactionDto,
      request.user['id'],
    );
  }

  @ApiOkResponse({ description: 'Withdraw successful' })
  @ApiForbiddenResponse({ description: 'Unsuficient balance' })
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  @ApiBearerAuth()
  @Post('withdraw')
  async withdraw(
    @Body() depositTransactionDto: WithdrawalAndDepositTransactionDto,
    @Req() request: Request,
  ) {
    return await this.transactionService.withdrawal(
      depositTransactionDto,
      request.user['id'],
    );
  }
}
