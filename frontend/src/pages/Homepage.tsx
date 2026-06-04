import { useEffect, useState } from "react";
import TransactionHistory from "../components/TransactionHistory.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import { Wallet } from "lucide-react";
import {createTransaction} from "../api/TransactionApi.tsx";
import { getMyWallet, createWallet } from "../api/WalletApi.tsx";
import { getJwtPayload } from "../utils/jwt.ts";

const user = getJwtPayload();

export default function Homepage() {
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [receiverWalletId, setReceiverWalletId] = useState("");
    const [amount, setAmount] = useState("");
    const [descrip, setDescrip] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [hasWallet, setHasWallet] = useState(false);
    const [isCreatingWallet, setIsCreatingWallet] = useState(false);
    const [walletLoaded, setWalletLoaded] = useState(false);


    async function handleCreateTransaction() {
        const senderWalletId = user?.sub;
        if (!senderWalletId) {
            setError("No se encontró el usuario. Iniciá sesión de nuevo.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await createTransaction({
                sender_wallet_id: senderWalletId,
                receiver_wallet_id: receiverWalletId,
                amount: Number(amount),
                descrip: descrip || undefined,
            });

            setReceiverWalletId("");
            setAmount("");
            setDescrip("");
            setIsTransactionModalOpen(false);
        } catch (error) {
            setError("No se pudo crear la transacción");
        } finally {
            setIsSubmitting(false);
        }
    }
    async function loadWallet() {
        try {
            const wallet = await getMyWallet();
            if (wallet) {
                setWalletBalance(wallet.balance);
                setHasWallet(true);
            } else {
                setWalletBalance(null);
                setHasWallet(false);
            }
        } catch {
            setWalletBalance(null);
            setHasWallet(false);
        } finally {
            setWalletLoaded(true);
        }
    }

    async function handleCreateWallet() {
        try {
            setIsCreatingWallet(true);
            await createWallet();
            await loadWallet();
        } catch {
            setError("No se pudo crear la wallet");
        } finally {
            setIsCreatingWallet(false);
        }
    }

    useEffect(() => {
        void loadWallet();
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
            <div className="p-4 md:p-8 lg:px-12 lg:py-8 max-w-7xl mx-auto w-full space-y-6 md:space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            <span className="text-[11px] font-semibold uppercase tracking-widest text-base-content/40">Dashboard</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-base-content">
                            Hola, <span className="text-primary">{user?.username ?? "Usuario"}</span>
                        </h1>
                        <p className="text-sm text-base-content/50">Resumen de tu actividad en la red</p>
                    </div>

                    <button
                        className="btn btn-primary btn-sm md:btn-md shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 gap-2"
                        onClick={() => setIsTransactionModalOpen(true)}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nueva Transacción
                    </button>
                </div>

                {/* Wallet Section */}
                {walletLoaded && !hasWallet ? (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/[0.07] to-base-200 border border-primary/20 shadow-xl shadow-primary/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="hero-content text-center py-14 md:py-20 relative">
                            <div className="max-w-md">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner shadow-primary/10">
                                        <Wallet className="w-10 h-10 text-primary" />
                                    </div>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold">Comienza a usar la Blockchain</h2>
                                <p className="text-base-content/50 mt-3 leading-relaxed text-sm md:text-base">
                                    Creá tu wallet para poder enviar y recibir transacciones en la red.
                                    Tus movimientos quedarán registrados de forma inmutable.
                                </p>
                                {error && (
                                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-error/10 text-error text-sm">
                                        <span>⚠</span> {error}
                                    </div>
                                )}
                                <button
                                    className="btn btn-primary btn-lg mt-7 shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 gap-2"
                                    onClick={handleCreateWallet}
                                    disabled={isCreatingWallet}
                                >
                                    {isCreatingWallet ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Creando...
                                        </>
                                    ) : (
                                        <>
                                            <Wallet className="w-5 h-5" />
                                            Crear Wallet
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-gradient-to-br from-base-100 to-base-200/50 shadow-sm border border-base-300/60 overflow-hidden">
                        <div className="p-5 md:p-6">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                <span className="text-[11px] font-semibold uppercase tracking-widest text-base-content/40">Wallet</span>
                            </div>
                            <SummaryCard
                                title={"Saldo Disponible"}
                                amount={walletBalance}
                                icon={Wallet}
                                textStyle={"text-primary"}
                                info={"Saldo actualizado desde wallet"}
                            />
                        </div>
                    </div>
                )}

                {/* Transactions */}
                <div className="w-full">
                    <TransactionHistory hasWallet={hasWallet} />
                </div>
            </div>

            {/* Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-base-100 shadow-2xl border border-base-300/60 overflow-hidden">
                        <div className="px-6 pt-6 pb-2 border-b border-base-200/60">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-primary/10">
                                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-lg">Nueva Transacción</h3>
                                </div>
                                <button
                                    className="btn btn-ghost btn-sm btn-square rounded-xl"
                                    onClick={() => setIsTransactionModalOpen(false)}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60">Wallet del destinatario</label>
                                <input
                                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                                    placeholder="0x..."
                                    value={receiverWalletId}
                                    onChange={(e) => setReceiverWalletId(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60">Monto</label>
                                <input
                                    className="input input-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                                    placeholder="0.00"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60">Descripción (opcional)</label>
                                <textarea
                                    className="textarea textarea-bordered w-full bg-base-200/50 focus:bg-base-100 transition-colors"
                                    placeholder="Agregá una descripción..."
                                    value={descrip}
                                    onChange={(e) => setDescrip(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={3}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error text-sm">
                                    <span>⚠</span> {error}
                                </div>
                            )}
                        </div>

                        <div className="px-6 pb-6 pt-1 flex gap-3 justify-end">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setIsTransactionModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-primary shadow-lg shadow-primary/20 gap-2"
                                onClick={handleCreateTransaction}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-xs"></span>
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                        Enviar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
