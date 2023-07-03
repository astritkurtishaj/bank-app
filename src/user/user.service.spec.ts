import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'mysecretkey'),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(() => 'mockedToken'),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a new user and return success message', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'test',
        lastName: 'test',
      };

      const expectedResult = {
        status: 201,
        message: 'User created successfully',
      };

      jest.spyOn(userService, 'create').mockResolvedValueOnce(expectedResult);

      const result = await userService.create(createUserDto);

      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if user with the email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'test',
        lastName: 'test',
      };

      const expectedResult = new BadRequestException(
        'User with this email exists',
      );

      jest.spyOn(userService, 'create').mockRejectedValueOnce(expectedResult);

      await expect(userService.create(createUserDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    it('should return a JWT token when login is successful', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      jest
        .spyOn(userService, 'login')
        .mockResolvedValueOnce({ token: 'mockedToken' });

      const result = await userService.login(loginUserDto);

      expect(result).toEqual({ token: 'mockedToken' });
    });

    it('should throw ForbiddenException when user with the email is not found', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.login(loginUserDto)).rejects.toThrowError(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the user with the given ID and return success message', async () => {
      const id = 1;

      const deleteSpy = jest
        .spyOn(userRepository, 'delete')
        .mockResolvedValueOnce(undefined);

      const result = await userService.remove(id);

      expect(deleteSpy).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        status: 200,
        message: 'User deleted successfuly',
      });
    });
  });
});
