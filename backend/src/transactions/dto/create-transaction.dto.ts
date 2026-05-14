import {IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @IsDefined()
    sender_wallet_id: string;

    @IsString()
    @IsDefined()
    receiver_wallet_id: string;

    @IsNumber()
    @IsDefined()
    amount: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    descrip?: string;
}
