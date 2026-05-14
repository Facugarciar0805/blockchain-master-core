import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import {MqttService} from "../mqtt/mqtt.service";
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {TransactionsRepositoryService} from "../repository/transaction/transactions.repository.service";

@Injectable()
export class TransactionsService {
  constructor(private transactionsRepository: TransactionsRepositoryService,
              private mqttService: MqttService) {
  }

  create(sender: number, createTransactionDto: CreateTransactionDto) {
    const info = {sender, ...createTransactionDto}
    this.mqttService.publishProblem(info);
    return this.transactionsRepository.create(sender, createTransactionDto);
  }

  findAll(user: number) {
    return this.transactionsRepository.findAllFromUser(user);
  }

  findOne(user: number, transactionId: number) {
    return this.transactionsRepository.findOne(user, transactionId);
  }

  findWithUser(userOne: number, userTwo: number){
      return this.transactionsRepository.findAllBetweenUsers(userOne, userTwo);
  }

}
