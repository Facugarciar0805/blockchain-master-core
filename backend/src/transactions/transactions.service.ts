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

  async create(user, createTransactionDto: CreateTransactionDto) {
    try {
      await this.mqttService.publishProblem(createTransactionDto);
    } catch {
      // Si falla MQTT o la DB igual seguimos, el problema se pierde
    }
    return { message: 'Problema de minería enviado a la cola', status: 'pending' };
  }
  findAllFromUser(user: number){
    return this.transactionsRepository.findAllFromUser(user);
  }

  findAll() {
    return this.transactionsRepository.findAll();
  }

  findOne(user: number, transactionId: number) {
    return this.transactionsRepository.findOne(user, transactionId);
  }

  findWithUser(userOne: number, userTwo: number){
      return this.transactionsRepository.findAllBetweenUsers(userOne, userTwo);
  }


}
