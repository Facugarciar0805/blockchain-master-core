export interface TransactionItemProps {
    transaction: TransactionType;
    loggedUserWalletId: string | null;
}

export interface TransactionType {
    prev_hash: string;
    hash: string;
    amount: number;
    sender_wallet_id: string;
    receiver_wallet_id: string;
    descrip?: string;
    status: string;
    nonce: number;
}

export interface CreateTransactionRequest {
    sender_wallet_id: string;
    receiver_wallet_id: string;
    amount: number;
    descrip?: string;
}

