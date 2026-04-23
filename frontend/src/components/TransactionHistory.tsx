import Transaction from './Transaction.tsx'
import type { TransactionType } from '../types/TransactionTypes.tsx'
import {getAllTransactions} from "../api/TransactionApi.tsx";
import {useCallback, useEffect, useState} from "react";

export default function TransactionHistory() {
    const currentUser = 'u1';
    const [transactions, setTransactions] = useState<TransactionType[]>([]);
    const loadTransactions = useCallback(async () => {
            return await getAllTransactions();
        }, []
    );
    const [isLoading, setIsLoading] = useState(true);
    useEffect(
        () => {
            const fetchTransactions = async () => {
                setIsLoading(true);
                const data = await loadTransactions();
                setTransactions(data);
                setIsLoading(false);
            }
            void fetchTransactions();
        }, [loadTransactions]
    )

    return (
        <div className="card bg-base-100 shadow-sm border border-base-300 w-full overflow-hidden">
            {/* Cabecera del Historial con Filtros */}
            <div className="bg-base-100 p-4 sm:p-6 border-b border-base-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="font-bold text-xl text-base-content m-0">
                        Últimos Movimientos
                    </h3>

                    {/* Buscador Mockeado */}
                    <div className="join w-full sm:w-auto">
                        <input className="input input-bordered input-sm join-item w-full sm:w-64" placeholder="Buscar transacción..." />
                        <button className="btn btn-sm join-item">Buscar</button>
                    </div>
                </div>

                {/* Pestañas (Tabs de DaisyUI) */}
                <div className="tabs tabs-boxed bg-base-200/50 p-1">
                    <a className="tab tab-active">Todas</a>
                    <a className="tab">Ingresos</a>
                    <a className="tab">Egresos</a>
                </div>
            </div>

            {/* Lista de Transacciones */}
            <div className="flex flex-col w-full">
                {isLoading ? (
                    <div className="p-10 flex justify-center">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : transactions.length > 0 ? (
                    transactions.map(tx => (
                        <Transaction
                            key={tx.hash}
                            transaction={tx}
                            loggedUserId={currentUser}
                        />
                    ))
                ) : (
                    <div className="p-10 text-center text-base-content/50">
                        No tienes movimientos recientes.
                    </div>
                )}
            </div>

            {/* Pie de tabla (Paginación mockeada) */}
            <div className="bg-base-200/30 p-4 border-t border-base-300 flex justify-center">
                <button className="btn btn-ghost btn-sm">Ver más movimientos</button>
            </div>
        </div>
    );
}