import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { CreateTransactionDto } from "../../transactions/dto/create-transaction.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TransactionsRepositoryService {
    constructor(private httpService: HttpService) {}

    async create(sender: string, createTransactionDto: CreateTransactionDto) {
        const body = { sender, ...createTransactionDto };
        const response = await firstValueFrom(
            this.httpService.post(`${process.env.DATABASE_URL}/transactions`, body)
        );
        return response.data;
    }

    async findAll(user: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/transactions`, {
                params: { user }
            })
        );
        return response.data;
    }

    async findOne(user: string, transactionId: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/transactions/${transactionId}`, {
                params: { user }
            })
        );
        return response.data;
    }

    async findWithUser(userOne: string, userTwo: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/transactions/user/${userTwo}`, {
                params: { userOne }
            })
        );
        return response.data;
    }
}