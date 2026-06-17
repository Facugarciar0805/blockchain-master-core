import Transaction from './Transaction.tsx'
import type { TransactionType } from '../types/TransactionTypes.tsx'
import { getAllTransactions } from "../api/TransactionApi.tsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, History, AlertCircle, Inbox } from "lucide-react";

type Tab = 'all' | 'incoming' | 'outgoing';

export default function TransactionHistory({ hasWallet, walletAddress }: { hasWallet: boolean; walletAddress: string | null }) {
    const loggedUserWalletId = walletAddress;
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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
        let filtered = transactions;
        if (activeTab === 'incoming') {
            filtered = filtered.filter(tx => tx.receiver_wallet_id === loggedUserWalletId);
        } else if (activeTab === 'outgoing') {
            filtered = filtered.filter(tx => tx.sender_wallet_id === loggedUserWalletId);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(tx =>
                tx.hash?.toLowerCase().includes(q) ||
                tx.sender_wallet_id?.toLowerCase().includes(q) ||
                tx.receiver_wallet_id?.toLowerCase().includes(q)
            );
        }
        return filtered;
    }, [transactions, activeTab, loggedUserWalletId, searchQuery]);

    const tabs: { key: Tab; label: string }[] = [
        { key: 'all', label: 'Todas' },
        { key: 'incoming', label: 'Ingresos' },
        { key: 'outgoing', label: 'Egresos' },
    ];

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-100 to-base-200/50 shadow-sm border border-base-300/60">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.02] rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-5 sm:p-6 border-b border-base-300/50 relative">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <History className="w-4 h-4 text-primary/60" />
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-base-content/40">Historial</span>
                        </div>
                        <h3 className="font-bold text-xl text-base-content tracking-tight">
                            {activeTab === 'all' ? 'Todas las Transacciones' : 'Últimos Movimientos'}
                        </h3>
                        <p className="text-xs text-base-content/40 mt-0.5">
                            {transactions.length} transaccione{transactions.length !== 1 ? 's' : ''} en total
                            {searchQuery.trim() && ` (${filteredTransactions.length} coinciden)`}
                        </p>
                    </div>
                    <div className="join w-full sm:w-auto shadow-sm">
                        <input
                            className="input input-bordered input-sm join-item w-full sm:w-56 bg-base-100/80 text-sm"
                            placeholder="Buscar por hash o dirección..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-sm join-item btn-ghost border border-base-300/60" disabled>
                            <Search className="w-4 h-4" />
                        </button>
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

            <div className="flex flex-col w-full relative">
                {isLoading ? (
                    <div className="p-12 flex flex-col items-center gap-3">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                        <span className="text-xs text-base-content/40">Cargando transacciones...</span>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <div className="p-3 rounded-full bg-error/10 w-fit mx-auto mb-3">
                            <AlertCircle className="w-6 h-6 text-error" />
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
                            <Inbox className="w-6 h-6 text-base-content/30" />
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