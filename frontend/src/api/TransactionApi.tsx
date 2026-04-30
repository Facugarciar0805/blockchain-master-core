import type { TransactionType } from '../types/TransactionTypes.tsx';
import type { UserCredentials } from "../types/UserTypes.tsx";

const url = import.meta.env.VITE_API_URL;
export async function createTransaction(transaction: TransactionType) {
    const token = localStorage.getItem('token');
    const response = await fetch(url + '/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
    })
    if (!response.ok) throw new Error(`Failed to create transaction from user ${transaction.sender} to user ${transaction.receiver} : ${response.status}`)
    return response.json()
}
export async function getAllTransactions() {
    const token = localStorage.getItem('token');
    const response = await fetch(url + '/transactions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    if (!response.ok) throw new Error(`Couldn't show transactions from user: ${response.status}`);
    return response.json();
}
export async function getAllTransactionsWithUser(user: UserCredentials){
    const token = localStorage.getItem('token');
    const response = await fetch(url + '/transactions' + user.id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
    if (!response.ok) throw new Error(`Couldn't get transactions with user ${user.id} : ${response.status}`);
    return response.json();
}