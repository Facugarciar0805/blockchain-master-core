import {Injectable} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class UserRepositoryService {
    constructor(private httpService: HttpService) {
    }
    async findByEmail(email: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/user`, {params: email})
        );
        return response.data;
    }
}