import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import {AuthModule} from "../authentication/auth.module";
import {TransactionsRepositoryModule} from "../repository/transactions/transactions.repository.module";
import {MqttModule} from "../mqtt/mqtt.module";

@Module({
  imports: [AuthModule, TransactionsRepositoryModule, MqttModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
