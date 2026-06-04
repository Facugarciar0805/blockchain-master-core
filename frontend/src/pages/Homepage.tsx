import { useEffect, useState } from "react";
import TransactionHistory from "../components/TransactionHistory.tsx";
import SummaryCard from "../components/SummaryCard.tsx";
import { Wallet } from "lucide-react";
import {createTransaction} from "../api/TransactionApi.tsx";
import { getMyWallet } from "../api/WalletApi.tsx";
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
    const [walletError, setWalletError] = useState<string | null>(null);
    const [hasWallet, setHasWallet] = useState(false);


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
    useEffect(() => {
        const loadWallet = async () => {
            try {
                setWalletError(null);

                const wallet = await getMyWallet();
                if (wallet) {
                    setWalletBalance(wallet.balance);
                    setHasWallet(true);
                } else {
                    setWalletBalance(null);
                    setHasWallet(false);
                }
            } catch (error) {
                setWalletError("No se pudo cargar el saldo");
                setWalletBalance(null);
                setHasWallet(false);
            }
        };

        void loadWallet();
    }, []);


    return (
        <div className="drawer lg:drawer-open bg-base-200 min-h-screen font-sans">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

            {/* CONTENIDO PRINCIPAL */}
            <div className="drawer-content flex flex-col">

                {/* Navbar Móvil */}
                <div className="w-full navbar bg-base-100 border-b border-base-300 lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="dashboard-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="flex-1 px-2 mx-2 font-bold text-xl">MiBanco</div>
                </div>

                {/* Dashboard Area */}
                <div className="p-4 md:p-8 lg:px-12 lg:py-8 max-w-7xl mx-auto w-full space-y-8">

                    {/* Saludo */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-bold text-base-content">Hola, {user?.username ?? "Usuario"}</h1>
                            <p className="text-base-content/60 mt-1">Aquí tienes el resumen de tu cuenta hoy.</p>
                        </div>

                        <button
                            className="btn btn-primary btn-sm md:btn-md"
                            onClick={() => setIsTransactionModalOpen(true)}
                        >
                            Nueva Transacción
                        </button>
                    </div>

                    <div className="stats stats-vertical md:stats-horizontal shadow w-full border border-base-300">
                        <SummaryCard
                            title={"Saldo Disponible"}
                            amount={walletBalance}
                            icon={Wallet}
                            textStyle={"text-primary"}
                            info={walletError ?? "Saldo actualizado desde wallet"}
                        />
                    </div>

                    <div className="w-full">
                        <TransactionHistory hasWallet={hasWallet} />
                    </div>
                </div>
            </div>

            {isTransactionModalOpen && (
                <dialog className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Nueva Transacción</h3>

                        <div className="space-y-4 mt-4">
                            <input
                                className="input input-bordered w-full"
                                placeholder="Wallet ID del destinatario"
                                value={receiverWalletId}
                                onChange={(e) => setReceiverWalletId(e.target.value)}
                                disabled={isSubmitting}
                            />

                            <input
                                className="input input-bordered w-full"
                                placeholder="Amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={isSubmitting}
                            />

                            <textarea
                                className="textarea textarea-bordered w-full"
                                placeholder="Description"
                                value={descrip}
                                onChange={(e) => setDescrip(e.target.value)}
                                disabled={isSubmitting}
                            />
                            {error && (
                                <p className="text-error text-sm">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn btn-ghost"
                                onClick={() => setIsTransactionModalOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={handleCreateTransaction}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creando..." : "Crear"}
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
}
