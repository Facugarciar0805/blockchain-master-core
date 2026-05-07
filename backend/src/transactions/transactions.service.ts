import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionsRepositoryService } from "../repository/transactions/transactions.repository.service";

@Injectable()
export class TransactionsService {
  constructor(private transactionsRepository: TransactionsRepositoryService) {}

  create(sender: string, createTransactionDto: CreateTransactionDto) {
    return this.transactionsRepository.create(sender, createTransactionDto);
  }

  findAll(user: string) {
    return this.transactionsRepository.findAll(user);
  }

  findOne(user: string, transactionId: string) {
    return this.transactionsRepository.findOne(user, transactionId);
  }

  findWithUser(userOne: string, userTwo: string) {
    return this.transactionsRepository.findWithUser(userOne, userTwo);
  }
}
