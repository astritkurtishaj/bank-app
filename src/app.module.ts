import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { getDataSource } from 'database/data-source';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '.env'),
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(getDataSource(new ConfigService())),
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AccountModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
