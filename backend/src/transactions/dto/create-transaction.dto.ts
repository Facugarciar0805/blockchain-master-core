import {IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateTransactionDto {
    @IsNumber()
    @IsDefined()
    receiver: string;

    @IsNumber()
    @IsDefined()
    amount: number;
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;
}
