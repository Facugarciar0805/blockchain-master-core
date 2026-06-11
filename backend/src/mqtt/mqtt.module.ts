import {Module} from "@nestjs/common";
import {MqttService} from "./mqtt.service";
import {TransactionsRepositoryModule} from "../repository/transaction/transactions.repository.module";
import {WalletRepositoryModule} from "../repository/wallet/wallet.repository.module";

@Module({
    imports: [TransactionsRepositoryModule, WalletRepositoryModule],
    providers: [MqttService],
    exports: [MqttService],
})
export class MqttModule {}