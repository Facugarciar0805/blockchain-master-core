import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionsModule } from './transactions/transactions.module';
import {AuthModule} from "./authentication/auth.module";
import {TransactionsRepositoryModule} from "./repository/transactions/transactions.repository.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [TransactionsModule, AuthModule, TransactionsRepositoryModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
