import type {User} from './UserTypes.tsx'

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED';

export interface TransactionItemProps {
    transaction: TransactionType;
    loggedUserId: string;
}

export interface TransactionType {
    hash: string;
    amount: number;
    sender: User;
    receiver: User;
    timestamp: Date;
    description?: string;
    status: TransactionStatus;
}

