import {Module} from "@nestjs/common";
import {WalletController} from "./wallet.controller";
import {WalletService} from "./wallet.service";
import {WalletRepositoryModule} from "../repository/wallet/wallet.repository.module";
import {AuthModule} from "../authentication/auth.module";

@Module({
    imports: [WalletRepositoryModule, AuthModule],
    controllers: [WalletController],
    providers: [WalletService],
})
export class WalletModule {}
