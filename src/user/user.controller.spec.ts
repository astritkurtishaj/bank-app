import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtGuard } from 'src/guards';
import { User } from './entities/user.entity';
import { Account } from '../account/entities/account.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should call userService.create and return the created user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'test',
        last_name: 'test',
        password: 'test',
        email: 'test@test.com',
      };
      const createdUser = {};

      jest.spyOn(service, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toBe(createdUser);
    });
  });

  describe('login', () => {
    it('should call userService.login and return the logged-in user', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@test.com',
        password: 'test',
      };
      const loggedInUser = {};

      jest.spyOn(service, 'login').mockResolvedValue(loggedInUser);

      const result = await controller.login(loginUserDto);

      expect(service.login).toHaveBeenCalledWith(loginUserDto);
      expect(result).toBe(loggedInUser);
    });
  });

  describe('findAll', () => {
    it('should call userService.findAll and return all users', async () => {
      const allUsers: User[] = [
        {
          id: 1,
          first_name: 'Test',
          last_name: 'test',
          email: 'test@test.com',
          password:
            '$2b$10$XPdyVfR5MhQtNAciMRIDE.qUedBzoc5vmuyQ7m8zVdOrZ9Qy.a.SC',
          updatedAt: new Date(),
          createdAt: new Date(),
          account: {
            id: 1,
            balance: 30,
            updatedAt: new Date(),
            createdAt: new Date(),
            accountNumber: '',
            bonus: 0,
            user: new User(),
            transactions: [],
          },
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(allUsers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBe(allUsers);
    });
  });

  describe('filterUsersByBonus', () => {
    it('should call userService.filterUsersByBonus and return filtered users', async () => {
      const filteredUsers = [];

      jest
        .spyOn(service, 'filterUsersByBonus')
        .mockResolvedValue(filteredUsers);

      const result = await controller.filterUsersByBonus();

      expect(service.filterUsersByBonus).toHaveBeenCalled();
      expect(result).toBe(filteredUsers);
    });
  });

  describe('remove', () => {
    it('should call userService.remove with the provided id and return the removed user', async () => {
      const userId = '123';
      const expectedResult = {
        status: 200,
        message: 'User deleted successfuly',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(expectedResult);

      const result = await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(+userId);
      expect(result).toBe(expectedResult);
    });
  });
});
