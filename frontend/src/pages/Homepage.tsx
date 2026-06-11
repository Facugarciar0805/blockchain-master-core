import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionHistory from "../components/TransactionHistory.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import { Wallet, LogOut, ArrowUpRight, Copy, X } from "lucide-react";
import {createTransaction} from "../api/TransactionApi.tsx";
import { getMyWallet, createWallet } from "../api/WalletApi.tsx";
import { getJwtPayload } from "../utils/jwt.ts";

export default function Homepage() {
    const user = getJwtPayload();
    const navigate = useNavigate();
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [receiverWalletId, setReceiverWalletId] = useState("");
    const [amount, setAmount] = useState("");
    const [descrip, setDescrip] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [hasWallet, setHasWallet] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isCreatingWallet, setIsCreatingWallet] = useState(false);
    const [walletLoaded, setWalletLoaded] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);


    async function handleCreateTransaction() {
        if (!walletAddress) {
            setError("No se encontró tu wallet. Creá una primero.");
            return;
        }

        if (Number(amount) <= 0) {
            setError("El monto debe ser mayor a 0");
            return;
        }

        if (Number(amount) > (walletBalance ?? 0)) {
            setError("Saldo insuficiente");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await createTransaction({
                sender_wallet_id: walletAddress,
                receiver_wallet_id: receiverWalletId,
                amount: Number(amount),
                descrip: descrip || undefined,
            });

            setReceiverWalletId("");
            setAmount("");
            setDescrip("");
            setIsTransactionModalOpen(false);
            setSuccessMessage("Transacción enviada a la cola de minería");
            setTimeout(() => setSuccessMessage(null), 4000);
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
                setWalletAddress(wallet.address);
                setHasWallet(true);
            } else {
                setWalletBalance(null);
                setWalletAddress(null);
                setHasWallet(false);
            }
        } catch {
            setWalletBalance(null);
            setWalletAddress(null);
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

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    async function handleCopyAddress() {
        if (!walletAddress) return;
        await navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-base-content flex items-center gap-3 flex-wrap">
                            Hola, <span className="text-primary">{user?.username ?? "Usuario"}</span>
                            <button
                                className="btn btn-xs rounded-full border border-base-content/15 bg-base-100/50 text-base-content/40 hover:text-base-content/60 hover:border-base-content/30 transition-all"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-3 h-3" />
                                Cerrar sesión
                            </button>
                        </h1>
                        <p className="text-sm text-base-content/50">Resumen de tu actividad en la red</p>
                    </div>

                    {hasWallet && (
                        <div className="flex items-center gap-3">
                            <button
                                className="btn btn-primary btn-sm md:btn-md shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 gap-2"
                                onClick={() => setIsTransactionModalOpen(true)}
                            >
                                <ArrowUpRight className="w-4 h-4" />
                                Nueva Transacción
                            </button>
                        </div>
                    )}
                </div>

                {successMessage && (
                    <div className="relative overflow-hidden rounded-xl bg-success/10 text-success text-sm border border-success/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-2.5 px-4 py-3 relative">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {successMessage}
                        </div>
                    </div>
                )}

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
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-success/10 via-success/[0.04] to-base-200 border border-success/15 shadow-xl shadow-success/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/5 rounded-full blur-3xl"></div>
                        <div className="p-5 md:p-6 relative">
                            <SummaryCard
                                title={"Saldo Disponible"}
                                amount={walletBalance}
                                icon={Wallet}
                                textStyle={"text-success"}
                                info={"Saldo actualizado desde wallet"}
                            />
                            <div className="mt-3 pt-4 border-t border-success/10 flex items-center gap-2.5">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0"></span>
                                    <span className="text-xs text-base-content/40 font-mono truncate" title={walletAddress ?? ""}>
                                        {walletAddress ?? "—"}
                                    </span>
                                </div>
                                <button
                                    className="btn btn-ghost btn-xs btn-square shrink-0 text-base-content/40 hover:text-success/70 transition-all duration-200"
                                    onClick={handleCopyAddress}
                                    title="Copiar dirección"
                                >
                                    {copied ? (
                                        <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                    )}
                                </button>
                            </div>
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
                    <div className="relative w-full max-w-md rounded-2xl bg-base-100 shadow-2xl border border-base-300/60 overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="px-6 pt-6 pb-2 border-b border-base-200/60 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner shadow-primary/10">
                                        <ArrowUpRight className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg">Nueva Transacción</h3>
                                </div>
                                <button
                                    className="btn btn-ghost btn-sm btn-square rounded-xl"
                                    onClick={() => setIsTransactionModalOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 relative">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                                    Tu Wallet
                                </label>
                                <div className="input input-bordered w-full bg-base-200/30 text-sm font-mono text-base-content/70 flex items-center gap-2 cursor-default pr-1">
                                    <span className="truncate">{walletAddress ?? "—"}</span>
                                    <button
                                        className="btn btn-ghost btn-xs btn-square ml-auto shrink-0 text-base-content/40 hover:text-base-content/70 transition-colors"
                                        onClick={() => walletAddress && navigator.clipboard.writeText(walletAddress)}
                                        title="Copiar dirección"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

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
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-base-content/60">Descripción <span className="text-base-content/30">(opcional)</span></label>
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
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error/10 text-error text-sm border border-error/10">
                                    <span>⚠</span> {error}
                                </div>
                            )}
                        </div>

                        <div className="px-6 pb-6 pt-1 flex gap-3 justify-end relative">
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
                                        <ArrowUpRight className="w-4 h-4" />
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
