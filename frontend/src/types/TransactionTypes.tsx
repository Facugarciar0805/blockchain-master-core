export interface TransactionItemProps {
    transaction: TransactionType;
    loggedUserWalletId: string;
}

export interface TransactionType {
    amount: number;
    sender: string;
    receiver: string;
    description?: string;
}

export interface CreateTransactionRequest {
    amount: number;
    receiver: string;
    description?: string;
}

