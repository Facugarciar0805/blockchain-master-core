import { useEffect, useState } from "react";
import { getPendingQueue, type PendingQueueResponse } from "../api/MiningApi.tsx";
import { ListOrdered, Loader, Zap, Hash, Cpu } from "lucide-react";

export default function PendingQueue() {
    const [queue, setQueue] = useState<PendingQueueResponse | null>(null);

    useEffect(() => {
        const fetchQueue = async () => {
            try {
                const data = await getPendingQueue();
                setQueue(data);
            } catch {
                setQueue(null);
            }
        };

        void fetchQueue();
        const interval = setInterval(fetchQueue, 3000);
        return () => clearInterval(interval);
    }, []);

    if (!queue || (queue.count === 0 && !queue.isProcessing)) return null;

    const miningTx = queue.isProcessing ? queue.currentMining : null;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-teal-500/[0.04] to-base-200 border border-teal-500/20 shadow-sm">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>
            <div className="p-5 sm:p-6 relative space-y-4">
                <div className="flex items-center gap-2 mb-0.5">
                    <ListOrdered className="w-4 h-4 text-teal-400/60" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-base-content/40">Cola de minería</span>
                </div>

                {miningTx && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                            <span className="text-sm font-semibold text-emerald-300">Minando ahora</span>
                            <Loader className="w-3.5 h-3.5 text-emerald-400 animate-spin ml-auto" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="font-mono text-xs text-emerald-200/70 truncate">
                                    {miningTx.sender_wallet_id.slice(0, 8)}...
                                </span>
                                <span className="text-emerald-200/40">→</span>
                                <span className="font-mono text-xs text-emerald-200/70 truncate">
                                    {miningTx.receiver_wallet_id.slice(0, 8)}...
                                </span>
                            </div>
                            <span className="font-semibold text-xs text-emerald-200 tabular-nums">
                                ${miningTx.amount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <p className="text-2xl font-bold text-white/90">{queue.count}</p>
                            <p className="text-xs text-white/40">transaccione{queue.count !== 1 ? 's' : ''} esperando</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                {queue.isProcessing ? (
                                    <Loader className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                                ) : (
                                    <Zap className="w-3.5 h-3.5 text-teal-400" />
                                )}
                                <span className="text-sm text-white/60">
                                    {queue.isProcessing ? 'Minando...' : 'En espera'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/30 font-mono">
                        <Hash className="w-3 h-3" />
                        <span className="truncate max-w-[120px]" title={queue.currentPrevHash}>
                            {queue.currentPrevHash.slice(0, 16)}...
                        </span>
                    </div>
                </div>

                {queue.count > 0 && (
                    <div className="space-y-1.5">
                        {queue.transactions.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-white/20 font-mono text-xs w-4">{i + 1}</span>
                                    <span className="font-mono text-xs text-white/60 truncate">
                                        {tx.sender_wallet_id.slice(0, 8)}...
                                    </span>
                                    <span className="text-white/20">→</span>
                                    <span className="font-mono text-xs text-white/60 truncate">
                                        {tx.receiver_wallet_id.slice(0, 8)}...
                                    </span>
                                </div>
                                <span className="font-semibold text-xs text-white/70 tabular-nums">
                                    ${tx.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
