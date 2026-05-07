import {IsDefined, IsNumber, IsString} from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @IsDefined()
    receiver: string;

    @IsNumber()
    @IsDefined()
    amount: number;
}
