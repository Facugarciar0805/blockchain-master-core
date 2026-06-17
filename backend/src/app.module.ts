import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TransactionsModule} from './transactions/transactions.module';
import {AuthModule} from "./authentication/auth.module";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import { RegisterModule } from './register/register.module';
import {LoginModule} from "./login/login.module";
import {WalletModule} from "./wallet/wallet.module";

@Module({
  imports: [TransactionsModule, AuthModule, ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}), JwtModule, RegisterModule, LoginModule, WalletModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
