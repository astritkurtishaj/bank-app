import { Injectable, NotFoundException } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: createAccountDto.email,
        },
      });

      if (user) {
        const accountNr = Math.floor(
          100000 + Math.random() * 900000,
        ).toString();
        const createdAccount = await this.accountRepository.save({
          accountNumber: accountNr,
          user: user,
        });
        return {
          status: 201,
          message: 'Account successfully created',
          accountNumber: createdAccount.accountNumber,
        };
      }
      throw new NotFoundException(
        `Account is not created. User with the email: ${createAccountDto.email} not found`,
      );
    } catch (error) {
      throw error;
    }
  }
}
