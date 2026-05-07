import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {UserRepositoryService} from "./user.repository.service";

@Module({
    imports: [HttpModule],
    providers: [UserRepositoryService],
    exports: [UserRepositoryService],
})
export class UserRepositoryModule {}