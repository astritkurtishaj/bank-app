import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtGuard } from 'src/guards';
import { User } from './entities/user.entity';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeaders,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ description: 'User created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiOkResponse({ description: 'user logged in' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiBearerAuth()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.login(loginUserDto);
  }

  @UseGuards(JwtGuard)
  @ApiOkResponse({ description: 'returns the array of users' })
  @ApiUnauthorizedResponse({ description: 'Unauthorised to make this call' })
  @ApiBearerAuth()
  @Get('all')
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtGuard)
  @ApiOkResponse({ description: 'Returns the array of filtered users' })
  @ApiUnauthorizedResponse({ description: 'Unauthorised to make this call' })
  @ApiBearerAuth()
  @Get('filter')
  async filterUsersByBonus() {
    return await this.userService.filterUsersByBonus();
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'User deleted succesfuly' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
