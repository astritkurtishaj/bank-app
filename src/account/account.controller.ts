import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { JwtGuard } from 'src/guards';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiCreatedResponse({ description: 'Account created' })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'Unauthorised' })
  @UseGuards(JwtGuard)
  @Post('create')
  create(@Req() request: Request) {
    return this.accountService.create(request.user['id']);
  }
}
