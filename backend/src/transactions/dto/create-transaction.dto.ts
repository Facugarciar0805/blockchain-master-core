export class CreateTransactionDto {
    receiver: string;
    amount: number;
    description?: string;
}
