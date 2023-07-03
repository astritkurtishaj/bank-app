import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { WithdrawalTransactionDto } from './dto/withdraw-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from 'src/account/entities/account.entity';
import { User } from 'src/user/entities/user.entity';
import { DepositTransactionDto } from './dto/deposit-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async deposit(depositTransactionDto: DepositTransactionDto, userId: number) {
    try {
      const receiverAccount = await this.accountRepository.findOne({
        where: { accountNumber: depositTransactionDto.receiverAccount },
        relations: ['user'],
      });

      const senderAccount = await this.accountRepository.findOne({
        where: { accountNumber: depositTransactionDto.senderAccount },
        relations: ['user'],
      });

      if (!receiverAccount)
        throw new NotFoundException('Receiver account not found');

      if (!senderAccount)
        throw new NotFoundException('Senders account not found!');

      if (senderAccount.user.id != userId)
        throw new UnauthorizedException(
          `You are not authorised to deposit from the account with number: ${depositTransactionDto.senderAccount}`,
        );

      if (!receiverAccount) {
        throw new NotFoundException(
          `Receiver account with number: ${depositTransactionDto.receiverAccount} not found`,
        );
      }

      await this.transactionRepository.save({
        type: 'deposit',
        account: senderAccount,
        amount: depositTransactionDto.amount,
      });

      if (depositTransactionDto.amount > 100) {
        receiverAccount.bonus += depositTransactionDto.amount * 0.05;
      }
      receiverAccount.balance += depositTransactionDto.amount;

      await this.accountRepository.save(receiverAccount);

      if (receiverAccount.id != senderAccount.id) {
        if (senderAccount.balance < depositTransactionDto.amount)
          throw new ForbiddenException('You do not have sufficient balance');
        senderAccount.balance -= depositTransactionDto.amount;
        await this.accountRepository.save(senderAccount);
      }
      return {
        status: 200,
        message: `${depositTransactionDto.amount}€ are deposited in your account with number ${receiverAccount.accountNumber}`,
      };
    } catch (error) {
      throw error;
    }
  }

  async withdrawal(
    withdrawTransactionDto: WithdrawalTransactionDto,
    userId: number,
  ) {
    try {
      const withdrawalAmount = withdrawTransactionDto.amount;

      const account = await this.accountRepository.findOne({
        where: { accountNumber: withdrawTransactionDto.accountNumber },
        relations: ['user'],
      });

      if (!account) {
        throw new NotFoundException(`Account with number: ${userId} not found`);
      }

      if (account.user.id != userId)
        throw new UnauthorizedException(
          'You are not authorized to withdraw from this account',
        );

      if (withdrawalAmount > account.balance) {
        throw new ForbiddenException('No sufficient balance');
      }

      await this.transactionRepository.save({
        type: 'withdrawal',
        account: account,
        amount: withdrawTransactionDto.amount,
      });

      account.balance -= withdrawalAmount;

      await this.accountRepository.save(account);
      return {
        status: 200,
        message: `${withdrawalAmount}€ withdrawed from your account: ${account.accountNumber}`,
      };
    } catch (error) {
      throw error;
    }
  }
}
