import {Module} from "@nestjs/common";
import {TransactionsRepositoryService} from "./transactions.repository.service";

@Module({
    providers: [TransactionsRepositoryService],
    exports: [TransactionsRepositoryService]
})
export class TransactionsRepositoryModule {}