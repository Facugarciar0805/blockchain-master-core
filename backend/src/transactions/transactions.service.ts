import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {TransactionsRepositoryService} from "../repository/transactions/transactions.repository.service";

@Injectable()
export class TransactionsService {
    constructor(private transactionsRepository: TransactionsRepositoryService) {
    }

  create(sender: number, createTransactionDto: CreateTransactionDto) {
    return this;
  }

  findAll(user: number) {
    return `This action returns all transactions`;
  }

  findOne(user: number, postId: number) {
    return `This action returns a #${postId} transaction`;
  }

  findWithUser(userOne: number, userTwo: number){
      return 'bla'
  }
}
