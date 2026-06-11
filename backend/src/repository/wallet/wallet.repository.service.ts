import {Injectable} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class WalletRepositoryService {
    constructor(private httpService: HttpService) {}

    async findByUserId(userId: number) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/wallets`)
        );
        const wallets = response.data as any[];
        return wallets.find(w => w.user_id === userId.toString()) ?? null;
    }

    async create(userId: number) {
        const body = {
            user_id: userId.toString(),
            address: `0x${userId}${Date.now().toString(16)}`,
            balance: 100,
            status: "active",
        };
        const response = await firstValueFrom(
            this.httpService.post(`${process.env.DATABASE_URL}/wallets`, body)
        );
        return response.data;
    }
}
