import Transaction from './Transaction.tsx'
import type { TransactionType } from '../types/TransactionTypes.tsx'
import { getAllTransactions } from "../api/TransactionApi.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getJwtPayload } from "../utils/jwt.ts";

type Tab = 'all' | 'incoming' | 'outgoing';

export default function TransactionHistory() {
    const loggedUserWalletId = getJwtPayload()?.sub ?? null;
    const [activeTab, setActiveTab] = useState<Tab>('all');
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

    const filteredTransactions = useMemo(() => {
        if (activeTab === 'all') return transactions;
        return transactions.filter(tx =>
            activeTab === 'incoming'
                ? tx.receiver_wallet_id === loggedUserWalletId
                : tx.sender_wallet_id === loggedUserWalletId
        );
    }, [transactions, activeTab, loggedUserWalletId]);

    const tabs: { key: Tab; label: string }[] = [
        { key: 'all', label: 'Todas' },
        { key: 'incoming', label: 'Ingresos' },
        { key: 'outgoing', label: 'Egresos' },
    ];

    return (
        <div className="card bg-base-100 shadow-sm border border-base-300 w-full overflow-hidden">
            <div className="bg-base-100 p-4 sm:p-6 border-b border-base-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="font-bold text-xl text-base-content m-0">
                        {activeTab === 'all' ? 'Todas las Transacciones' : 'Últimos Movimientos'}
                    </h3>
                    <div className="join w-full sm:w-auto">
                        <input className="input input-bordered input-sm join-item w-full sm:w-64" placeholder="Buscar transacción..." />
                        <button className="btn btn-sm join-item">Buscar</button>
                    </div>
                </div>
                <div className="tabs tabs-boxed bg-base-200/50 p-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            className={`tab ${activeTab === tab.key ? 'tab-active' : ''}`}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.label}
                        </button>
                    ))}
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
                ) : filteredTransactions.length > 0 ? (
                    <>
                        {activeTab === 'all' && (
                            <div className="grid grid-cols-12 gap-2 items-center px-3 py-2 text-xs font-bold text-base-content/50 uppercase tracking-wider border-b border-base-200 bg-base-200/30">
                                <div className="col-span-3">Hash</div>
                                <div className="col-span-4">De → Para</div>
                                <div className="col-span-3 text-right">Monto</div>
                                <div className="col-span-2 text-right">Estado</div>
                            </div>
                        )}
                        {filteredTransactions.map((tx, index) => (
                            <Transaction
                                key={index}
                                transaction={tx}
                                loggedUserWalletId={loggedUserWalletId}
                                compact={activeTab === 'all'}
                            />
                        ))}
                    </>
                ) : (
                    <div className="p-10 text-center text-base-content/50">
                        {activeTab === 'all'
                            ? 'No hay transacciones todavía.'
                            : 'No tienes movimientos en esta categoría.'}
                    </div>
                )}
            </div>
        </div>
    );
}