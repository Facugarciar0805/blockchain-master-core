import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {CreateTransactionDto} from "../../transactions/dto/create-transaction.dto";
import {firstValueFrom} from "rxjs";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TransactionsRepositoryService {
    constructor(private httpService: HttpService, private config: ConfigService) {
    }
    async create(sender: number, createTransactionDto: CreateTransactionDto){
        const body = { sender, ...createTransactionDto };
        const response = await firstValueFrom(
            this.httpService.post(`${process.env.DATABASE_URL}/transactions`, body)
        );
        return response.data;

    }
    async findAllFromUser(userId: number) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/transactions/${userId}`)
        );
        return response.data;
    }
    async findAllBetweenUsers(user1: number, user2: number) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/transactions`, {params: {user1, user2}})
        );
        return response.data;
    }
    async findOne(userId: number, transactionId: number) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/transactions`, {params: {userId, transactionId}})
        );
        return response.data;
    }
    async findLast(){
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/transactions/last`)
        );
        return response.data;
    }
}