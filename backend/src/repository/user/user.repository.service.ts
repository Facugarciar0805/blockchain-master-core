import {Injectable} from "@nestjs/common";
import {firstValueFrom} from "rxjs";
import {HttpService} from "@nestjs/axios";
import {RegisterDto} from "../../register/dto/register.dto";
import {UpdateRegisterDto} from "../../register/dto/update.register.dto";

@Injectable()
export class UserRepositoryService {
    constructor(private httpService: HttpService) {
    }
    async findByEmail(email: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/user`, {params: {email}})
        );
        return response.data;
    }
    async createUser(registerDto: RegisterDto) {
        const body = { registerDto }
        const response = await firstValueFrom(
            this.httpService.post(`${process.env.DATABASE_URL}/user`, body)
        );
        return response.data;
    }
    async findAll(){
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/user`)
        );
        return response.data;
    }
    async findById(userId: number) {
        const response = await firstValueFrom(
            this.httpService.get(`${process.env.DATABASE_URL}/user`, {params: {userId}})
        );
        return response.data;
    }
    async update(userId: number, updateDto: UpdateRegisterDto){
        const body = { userId, ...updateDto};
        const response = await firstValueFrom(
            this.httpService.post(`${process.env.DATABASE_URL}/user`, body)
        );
        return response.data;
    }
    async remove(userId: number){
        const response = await firstValueFrom(
            this.httpService.delete(`${process.env.DATABASE_URL}/user`, {params: {userId}})
        )
        return response.data;
    }
}