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

      if (!receiverAccount) {
        throw new NotFoundException(
          `Receiver account with number: ${depositTransactionDto.receiverAccount} not found`,
        );
      }

      if (receiverAccount.user.id == userId) {
        await this.depositToAccount(
          receiverAccount,
          depositTransactionDto.amount,
        );
      } else {
        const senderAccount = await this.findSenderAccount(userId);
        await this.transferAmount(
          senderAccount,
          receiverAccount,
          depositTransactionDto.amount,
        );
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

      if (account.user.id !== userId) {
        throw new UnauthorizedException(
          'You are not authorized to withdraw from this account',
        );
      }

      if (withdrawalAmount > account.balance) {
        throw new ForbiddenException('Insufficient balance');
      }

      await this.performWithdrawal(account, withdrawalAmount);

      return {
        status: 200,
        message: `${withdrawalAmount}€ withdrawn from your account: ${account.accountNumber}`,
      };
    } catch (error) {
      throw error;
    }
  }

  private async performWithdrawal(account: Account, withdrawalAmount: number) {
    await this.createTransaction(account, withdrawalAmount);

    account.balance -= withdrawalAmount;

    await this.accountRepository.save(account);
  }

  async createTransaction(account: Account, amount: number, isDeposit = false) {
    await this.transactionRepository.save({
      type: isDeposit ? 'deposit' : 'withdrawal',
      account: account,
      amount: amount,
    });
  }

  private calculateBonus(amount: number) {
    if (amount > 100) {
      return amount * 0.05;
    }
    return 0;
  }

  private async depositToAccount(account: Account, amount: number) {
    await this.createTransaction(account, amount, true);

    const bonus = this.calculateBonus(amount);
    account.bonus += bonus;
    account.balance += amount;

    await this.accountRepository.save(account);
  }

  private async findSenderAccount(userId: number) {
    const senderAccount = await this.accountRepository
      .createQueryBuilder('account')
      .innerJoin('account.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!senderAccount)
      throw new NotFoundException("Sender's account not found!");

    return senderAccount;
  }

  private async transferAmount(
    senderAccount: Account,
    receiverAccount: Account,
    amount: number,
  ) {
    if (senderAccount.balance < amount)
      throw new ForbiddenException('You do not have sufficient balance');

    await this.createTransaction(senderAccount, amount, true);

    receiverAccount.balance += amount;
    senderAccount.balance -= amount;

    const bonus = this.calculateBonus(amount);
    senderAccount.bonus += bonus;

    await this.accountRepository.save(receiverAccount);
    await this.accountRepository.save(senderAccount);
  }
}
