import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TransactionsModule} from './transactions/transactions.module';
import {AuthModule} from "./authentication/auth.module";
import {TransactionsRepositoryModule} from "./repository/transaction/transactions.repository.module";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import { RegisterModule } from './register/register.module';
import {LoginModule} from "./login/login.module";

@Module({
  imports: [TransactionsModule, AuthModule, ConfigModule.forRoot({isGlobal: true}), JwtModule, RegisterModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
