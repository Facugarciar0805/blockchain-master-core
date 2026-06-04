import type { TransactionType, CreateTransactionRequest } from '../types/TransactionTypes.tsx';

const url = import.meta.env.VITE_API_URL;

export async function createTransaction(transaction: CreateTransactionRequest) {
    const token = localStorage.getItem('token');
    const response = await fetch(url + '/transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
    });

    if (!response.ok) {
        throw new Error(`Failed to create transaction: ${response.status}`);
    }

    return response.json();
}

export async function getAllTransactions(): Promise<TransactionType[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(url + '/transaction', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Couldn't show transactions from user: ${response.status}`);
    }

    return response.json();
}

export async function getAllTransactionsWithUser(userId: string): Promise<TransactionType[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(url + `/transaction/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        throw new Error(`Couldn't get transactions with user ${userId}: ${response.status}`);
    }

    return response.json();
}
