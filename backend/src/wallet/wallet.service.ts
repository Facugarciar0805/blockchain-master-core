import {Injectable} from "@nestjs/common";
import {WalletRepositoryService} from "../repository/wallet/wallet.repository.service";

@Injectable()
export class WalletService {
    constructor(private walletRepository: WalletRepositoryService) {}

    async getMyWallet(userId: number) {
        const wallet = await this.walletRepository.findByUserId(userId);
        return wallet ?? null;
    }

    async createWallet(userId: number) {
        return this.walletRepository.create(userId);
    }
}
