import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WithdrawalAndDepositTransactionDto } from './dto/withdraw-deposit-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from 'src/account/entities/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}
  async deposit(
    depositTransactionDto: WithdrawalAndDepositTransactionDto,
    userId: number,
  ) {
    try {
      const account = await this.accountRepository
        .createQueryBuilder('accounts')
        .where('accounts.userId = :userId', { userId })
        .getOne();

      const transaction = await this.transactionRepository.save({
        type: 'deposit',
        account: account,
        amount: depositTransactionDto.amount,
      });

      if (depositTransactionDto.amount > 100) {
        account.bonus += depositTransactionDto.amount * 0.05;
      }
      account.balance += depositTransactionDto.amount;

      await this.accountRepository.save(account);
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async withdrawal(
    depositTransactionDto: WithdrawalAndDepositTransactionDto,
    userId: number,
  ) {
    try {
      const withdrawalAmount = depositTransactionDto.amount;

      const account = await this.accountRepository
        .createQueryBuilder('accounts')
        .where('accounts.userId = :userId', { userId })
        .getOne();

      if (!account) {
        throw new NotFoundException(`Account not found for userId: ${userId}`);
      }

      if (withdrawalAmount > account.balance) {
        throw new ForbiddenException('No sufficient balance');
      }
      const transaction = await this.transactionRepository.save({
        type: 'withdrawal',
        account: account,
        amount: depositTransactionDto.amount,
      });

      account.balance -= withdrawalAmount;

      await this.accountRepository.save(account);
      return transaction;
    } catch (error) {
      throw error;
    }
  }
}
