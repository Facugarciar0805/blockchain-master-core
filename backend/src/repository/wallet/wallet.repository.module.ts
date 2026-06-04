import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {WalletRepositoryService} from "./wallet.repository.service";

@Module({
    imports: [HttpModule],
    providers: [WalletRepositoryService],
    exports: [WalletRepositoryService],
})
export class WalletRepositoryModule {}
