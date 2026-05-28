export class CreateBlockDto {
    prev_hash: string;
    hash: string;
    amount: number;
    sender_wallet_id: string;
    receiver_wallet_id: string;
    descrip?: string;
    status: string;
    nonce: number;
}
