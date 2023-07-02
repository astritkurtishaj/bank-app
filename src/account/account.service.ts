import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(userId: number) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      const r = (Math.random() + 1).toString(36).substring(7);
      const createdAccount = await this.accountRepository.save({
        accountNumber: r,
        user: user,
      });
      return createdAccount;
    } catch (error) {
      throw error;
    }
  }
}
