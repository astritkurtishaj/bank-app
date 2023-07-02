import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwt: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<object> {
    try {
      const { password, ...otherProps } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      const userExists = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (userExists)
        throw new BadRequestException('User with this email exists');

      const newUser = await this.userRepository.save({
        password: hashedPassword,
        ...otherProps,
      });
      if (newUser) return { status: 201, message: 'User created successfuly' };
    } catch (error) {
      throw error;
    }
  }

  async login(userData: LoginUserDto) {
    try {
      const user = await this.userRepository.findOneOrFail({
        where: {
          email: userData.email,
        },
      });

      if (!user) {
        throw new ForbiddenException(
          'User with this email could not be found!',
        );
      }

      const pwdMatched = await bcrypt.compare(userData.password, user.password);

      if (!pwdMatched) {
        throw new ForbiddenException('Credentials not matched!');
      }

      return await this.signToken(user.id, user.email);
    } catch (error) {
      return error;
    }
  }

  async signToken(userId: number, email: string) {
    const payload = {
      id: userId,
      email,
    };
    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: secret,
    });

    return {
      token,
    };
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async filterUsersByBonus() {
    try {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.account', 'account')
        .where('account.bonus IS NOT NULL')
        .orderBy('account.bonus', 'ASC')
        .getMany();

      return users;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.userRepository.delete(id);

      return { status: 200, message: 'User deleted successfuly' };
    } catch (error) {
      throw error;
    }
  }
}
