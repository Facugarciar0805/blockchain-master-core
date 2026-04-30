import {Injectable} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {CreateTransactionDto} from "../../transactions/dto/create-transaction.dto";
import {firstValueFrom} from "rxjs";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TransactionsRepositoryService {
    constructor(private httpService: HttpService) {
    }
    async create(sender: number, createTransactionDto: CreateTransactionDto){
        const body = { sender, ...createTransactionDto };
        const response = await firstValueFrom(
            this.httpService.post(`${process.env.DATABASE_URL}/transactions`, body)
        );
        return response.data;

    }
}