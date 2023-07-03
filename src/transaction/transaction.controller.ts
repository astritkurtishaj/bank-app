import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { WithdrawalTransactionDto } from './dto/withdraw-transaction.dto';
import { Request } from 'express';
import { JwtGuard } from 'src/guards';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DepositTransactionDto } from './dto/deposit-transaction.dto';

@UseGuards(JwtGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOkResponse({ description: 'Deposit successful' })
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  @ApiNotFoundResponse({ description: 'Not found error' })
  @ApiForbiddenResponse({ description: 'Forbidden error' })
  @ApiBearerAuth()
  @Post('deposit')
  async deposit(
    @Body() depositTransactionDto: DepositTransactionDto,
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
  @ApiNotFoundResponse({ description: 'Not found error' })
  @ApiBearerAuth()
  @Post('withdraw')
  async withdraw(
    @Body()
    depositTransactionDto: WithdrawalTransactionDto,
    @Req() request: Request,
  ) {
    return await this.transactionService.withdrawal(
      depositTransactionDto,
      request.user['id'],
    );
  }
}
