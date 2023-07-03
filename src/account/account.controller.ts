import { Controller, Post, Body } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiCreatedResponse({ description: 'Account created' })
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  @ApiNotFoundResponse({
    description: 'User not with email provided not found!',
  })
  @Post('create')
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }
}
