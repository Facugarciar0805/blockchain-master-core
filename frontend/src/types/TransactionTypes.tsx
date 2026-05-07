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

