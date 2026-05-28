import Transaction from './Transaction.tsx'
import type { TransactionType } from '../types/TransactionTypes.tsx'
import { getAllTransactions } from "../api/TransactionApi.tsx";
import { useCallback, useEffect, useState } from "react";


function getWalletIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub ?? null;
      } catch {
      return null;
}

}

export default function TransactionHistory() {
    const loggedUserWalletId = getWalletIdFromToken();
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTransactions = useCallback(async () => {
        return await getAllTransactions();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await loadTransactions();
                setTransactions(data);
            } catch (e) {
                setError('No se pudieron cargar las transacciones');
            } finally {
                setIsLoading(false);
            }
        };
        void fetchTransactions();
    }, [loadTransactions]);

    return (
        <div className="card bg-base-100 shadow-sm border border-base-300 w-full overflow-hidden">
            <div className="bg-base-100 p-4 sm:p-6 border-b border-base-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="font-bold text-xl text-base-content m-0">Últimos Movimientos</h3>
                    <div className="join w-full sm:w-auto">
                        <input className="input input-bordered input-sm join-item w-full sm:w-64" placeholder="Buscar transacción..." />
                        <button className="btn btn-sm join-item">Buscar</button>
                    </div>
                </div>
                <div className="tabs tabs-boxed bg-base-200/50 p-1">
                    <a className="tab tab-active">Todas</a>
                    <a className="tab">Ingresos</a>
                    <a className="tab">Egresos</a>
                </div>
            </div>

            <div className="flex flex-col w-full">
                {isLoading ? (
                    <div className="p-10 flex justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : error ? (
                    <div className="p-10 text-center text-error">
                        {error}
                    </div>
                ) : transactions.length > 0 ? (
                    transactions.map((tx, index) => (
                        <Transaction
                            key={index}
                            transaction={tx}
                            loggedUserWalletId={loggedUserWalletId}
                        />
                    ))
                ) : (
                    <div className="p-10 text-center text-base-content/50">
                        No tienes movimientos recientes.
                    </div>
                )}
            </div>

            <div className="bg-base-200/30 p-4 border-t border-base-300 flex justify-center">
                <button className="btn btn-ghost btn-sm">Ver más movimientos</button>
            </div>
        </div>
    );
}