import {IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class CreateTransactionDto {
    @IsString()
    @IsDefined()
    sender_wallet_id: string;

    @IsString()
    @IsDefined()
    receiver_wallet_id: string;

    @IsNumber()
    @IsPositive()
    @IsDefined()
    amount: number;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    descrip?: string;
}
