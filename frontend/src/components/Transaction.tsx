import type { TransactionItemProps } from '../types/TransactionTypes.tsx'

export default function Transaction({ transaction, loggedUserWalletId, compact }: TransactionItemProps) {
    const { amount, sender_wallet_id, receiver_wallet_id, descrip, hash, status } = transaction;

    const isSender = loggedUserWalletId !== null && sender_wallet_id === loggedUserWalletId;

    const formattedAmount = isSender ? `- $${amount.toLocaleString()}` : `+ $${amount.toLocaleString()}`;
    const amountColorClass = isSender ? 'text-error' : 'text-success';

    if (compact) {
        return (
            <div className="grid grid-cols-12 gap-2 items-center p-3.5 border-b border-base-200/80 bg-base-100 hover:bg-gradient-to-r hover:from-primary/[0.02] hover:to-transparent transition-all duration-200 text-sm group">
                <div className="col-span-3 font-mono text-xs text-base-content/50 truncate group-hover:text-primary/70 transition-colors" title={hash}>
                    {hash ? hash.slice(0, 14) + '...' : '—'}
                </div>
                <div className="col-span-4 truncate flex items-center gap-1">
                    <span className="font-mono text-xs text-base-content/80">{sender_wallet_id?.slice(0, 8) || '...'}</span>
                    <span className="text-base-content/30 text-xs">→</span>
                    <span className="font-mono text-xs text-base-content/80">{receiver_wallet_id?.slice(0, 8) || '...'}</span>
                </div>
                <div className="col-span-3 text-right font-semibold text-sm">
                    ${amount.toLocaleString()}
                </div>
                <div className="col-span-2 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        status === 'confirmed'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                    }`}>
                        <span className={`w-1 h-1 rounded-full ${status === 'confirmed' ? 'bg-success' : 'bg-warning'}`}></span>
                        {status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                    </span>
                </div>
            </div>
        );
    }

    const title = isSender ? `Enviado a ${receiver_wallet_id?.slice(0, 8)}...` : `Recibido de ${sender_wallet_id?.slice(0, 8)}...`;
    const iconBgClass = isSender ? 'bg-error/10 text-error' : 'bg-success/10 text-success';
    const icon = isSender ? '↑' : '↓';

    return (
        <div className="flex items-center justify-between p-4 border-b border-base-200/80 bg-base-100 hover:bg-gradient-to-r hover:from-primary/[0.02] hover:to-transparent transition-all duration-200 group">
            <div className="flex items-center gap-3.5">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm transition-transform group-hover:scale-110 ${iconBgClass}`}>
                    {icon}
                </div>

                <div className="flex flex-col">
                    <span className="font-semibold text-sm text-base-content">{title}</span>
                    {descrip && (
                        <span className="text-xs text-base-content/50 mt-0.5 line-clamp-1">{descrip}</span>
                    )}
                </div>
            </div>

            <div className={`font-bold text-base tabular-nums ${amountColorClass}`}>
                {formattedAmount}
            </div>
        </div>
    );
}