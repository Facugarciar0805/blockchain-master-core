import Transaction from './Transaction.tsx'
import type { TransactionType } from '../types/TransactionTypes.tsx'
import { getAllTransactions } from "../api/TransactionApi.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getJwtPayload } from "../utils/jwt.ts";

type Tab = 'all' | 'incoming' | 'outgoing';

export default function TransactionHistory({ hasWallet }: { hasWallet: boolean }) {
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
        <div className="rounded-xl bg-gradient-to-br from-base-100 to-base-200/50 shadow-sm border border-base-300/60 overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-base-300/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <div>
                        <h3 className="font-bold text-xl text-base-content tracking-tight">
                            {activeTab === 'all' ? 'Todas las Transacciones' : 'Últimos Movimientos'}
                        </h3>
                        <p className="text-xs text-base-content/40 mt-0.5">
                            {filteredTransactions.length} transaccione{filteredTransactions.length !== 1 ? 's' : ''} en total
                        </p>
                    </div>
                    <div className="join w-full sm:w-auto shadow-sm">
                        <input className="input input-bordered input-sm join-item w-full sm:w-56 bg-base-100/80 text-sm" placeholder="Buscar..." />
                        <button className="btn btn-sm join-item btn-ghost border border-base-300/60">Buscar</button>
                    </div>
                </div>
                {hasWallet && (
                    <div className="inline-flex p-0.5 rounded-lg bg-base-200/60 border border-base-300/40">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                                    activeTab === tab.key
                                        ? 'bg-base-100 shadow-sm text-base-content'
                                        : 'text-base-content/50 hover:text-base-content/80'
                                }`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col w-full">
                {isLoading ? (
                    <div className="p-12 flex flex-col items-center gap-3">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                        <span className="text-xs text-base-content/40">Cargando transacciones...</span>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="p-3 rounded-full bg-error/10 w-fit mx-auto mb-3">
                            <span className="text-error text-lg">!</span>
                        </div>
                        <p className="text-sm text-error font-medium">{error}</p>
                    </div>
                ) : filteredTransactions.length > 0 ? (
                    <>
                        {activeTab === 'all' && (
                            <div className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 text-[11px] font-semibold text-base-content/40 uppercase tracking-widest border-b border-base-200/60 bg-base-200/20">
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
                    <div className="p-12 text-center">
                        <div className="p-3 rounded-full bg-base-200/50 w-fit mx-auto mb-3">
                            <svg className="w-6 h-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <p className="text-sm text-base-content/40">
                            {activeTab === 'all'
                                ? 'No hay transacciones todavía.'
                                : 'No tienes movimientos en esta categoría.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}