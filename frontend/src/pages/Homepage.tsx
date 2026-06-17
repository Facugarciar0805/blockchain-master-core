import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionHistory from "../components/TransactionHistory.tsx";
import { Wallet, LogOut, Copy, X, Hexagon, Send, CreditCard } from "lucide-react";
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
        <div className="min-h-screen bg-[#0a0e17]">
            <div className="relative">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 space-y-6 md:space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10">
                            <Hexagon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white/80 hidden sm:inline">NovaChain</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-white/80">{user?.username ?? "Usuario"}</p>
                        </div>
                        <button
                            className="btn btn-xs rounded-full bg-white/5 border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Cerrar sesión</span>
                        </button>
                    </div>
                </div>

                {/* Greeting + Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white/90 tracking-tight">
                            Buena suerte, <span className="text-emerald-400">{user?.username ?? "Usuario"}</span>
                        </h1>
                        <p className="text-sm text-white/40 mt-1">Panel de control de tu actividad en la red</p>
                    </div>

                    {hasWallet && (
                        <button
                            className="btn bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300 gap-2"
                            onClick={() => setIsTransactionModalOpen(true)}
                        >
                            <Send className="w-4 h-4" />
                            Nueva Transacción
                        </button>
                    )}
                </div>

                {successMessage && (
                    <div className="relative overflow-hidden rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-2.5 px-4 py-3 relative">
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm text-emerald-300">{successMessage}</span>
                        </div>
                    </div>
                )}



                {/* Wallet Section */}
                {walletLoaded && !hasWallet ? (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/[0.07] to-base-200 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
                        <div className="hero-content text-center py-14 md:py-20 relative">
                            <div className="max-w-md">
                                <div className="flex justify-center mb-6">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-inner shadow-emerald-500/10">
                                        <Wallet className="w-10 h-10 text-emerald-400" />
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
                                    className="btn bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all duration-300 gap-2 btn-lg mt-7"
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
                ) : walletLoaded && hasWallet ? (
                    <div className="balance-card rounded-2xl shadow-2xl shadow-emerald-500/5 relative overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px]"></div>
                        <div className="p-6 md:p-8 relative">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard className="w-4 h-4 text-emerald-400/60" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Wallet</span>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-white/40 tracking-wide">Saldo Disponible</p>
                                <div className="mt-1 flex items-baseline gap-1.5">
                                    <span className="text-5xl md:text-6xl font-bold tracking-tight text-white">
                                        ${walletBalance?.toLocaleString() ?? <span className="loading loading-dots loading-md text-emerald-400" />}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                    <span className="text-xs text-white/30 font-mono truncate" title={walletAddress ?? ""}>
                                        {walletAddress ?? "—"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="btn btn-xs rounded-full bg-white/5 border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
                                        onClick={handleCopyAddress}
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copiado
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                Copiar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Transactions */}
                <div className="w-full">
                    <TransactionHistory hasWallet={hasWallet} walletAddress={walletAddress} />
                </div>
                </div>
            </div>

            {/* Modal */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-md glass-card rounded-2xl shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="px-6 pt-6 pb-2 border-b border-white/5 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-inner shadow-emerald-500/10">
                                        <Send className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white/90">Nueva Transacción</h3>
                                </div>
                                <button
                                    className="btn btn-ghost btn-sm btn-square rounded-xl text-white/30 hover:text-white/70"
                                    onClick={() => setIsTransactionModalOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4 relative">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                    Tu Wallet
                                </label>
                                <div className="input w-full bg-white/5 border-white/10 text-white/60 font-mono text-sm flex items-center gap-2 cursor-default pr-1">
                                    <span className="truncate">{walletAddress ?? "—"}</span>
                                    <button
                                        className="btn btn-ghost btn-xs btn-square ml-auto shrink-0 text-white/30 hover:text-white/60 transition-colors"
                                        onClick={() => walletAddress && navigator.clipboard.writeText(walletAddress)}
                                        title="Copiar dirección"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50">Wallet del destinatario</label>
                                <input
                                    className="input w-full bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none transition-all"
                                    placeholder="0x..."
                                    value={receiverWalletId}
                                    onChange={(e) => setReceiverWalletId(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50">Monto</label>
                                <input
                                    className="input w-full bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none transition-all"
                                    placeholder="0.00"
                                    type="number"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-white/50">Descripción <span className="text-white/20">(opcional)</span></label>
                                <textarea
                                    className="textarea w-full bg-white/5 border-white/10 text-white/80 placeholder:text-white/20 focus:border-emerald-500/30 focus:outline-none transition-all"
                                    placeholder="Agregá una descripción..."
                                    value={descrip}
                                    onChange={(e) => setDescrip(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={3}
                                />
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/10">
                                    <span className="text-lg leading-none">&#9888;</span>
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <div className="px-6 pb-6 pt-1 flex gap-3 justify-end relative">
                            <button
                                className="btn btn-ghost text-white/40 hover:text-white/70"
                                onClick={() => setIsTransactionModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg shadow-emerald-500/20 gap-2"
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
                                        <Send className="w-4 h-4" />
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
