import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {TransactionsRepositoryService} from "../repository/transactions/transactions.repository.service";

@Injectable()
export class TransactionsService {
  constructor(private transactionsRepository: TransactionsRepositoryService) {
  }

  create(sender: number, createTransactionDto: CreateTransactionDto) {
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
