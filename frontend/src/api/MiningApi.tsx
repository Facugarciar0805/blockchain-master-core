import type { CreateTransactionRequest } from '../types/TransactionTypes.tsx';

const url = import.meta.env.VITE_API_URL;

export interface PendingQueueResponse {
    count: number;
    transactions: CreateTransactionRequest[];
    isProcessing: boolean;
    currentPrevHash: string;
}

export async function getPendingQueue(): Promise<PendingQueueResponse> {
    const token = localStorage.getItem('token');
    const response = await fetch(url + '/transaction/queue', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to get pending queue: ${response.status}`);
    }

    return response.json();
}
