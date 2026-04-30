import {Module} from "@nestjs/common";
import {TransactionsRepositoryService} from "./transactions.repository.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    providers: [TransactionsRepositoryService],
    exports: [TransactionsRepositoryService]
})
export class TransactionsRepositoryModule {}