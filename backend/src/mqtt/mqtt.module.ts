import {Module} from "@nestjs/common";
import {MqttService} from "./mqtt.service";
import {TransactionsRepositoryModule} from "../repository/transaction/transactions.repository.module";

@Module({
    imports: [TransactionsRepositoryModule],
    providers: [MqttService],
    exports: [MqttService],
})
export class MqttModule {}