import type { TransactionItemProps } from '../types/TransactionTypes.tsx'

export default function Transaction({ transaction, loggedUserWalletId, compact }: TransactionItemProps) {
    const { amount, sender_wallet_id, receiver_wallet_id, descrip, hash, status } = transaction;

    const isSender = loggedUserWalletId !== null && sender_wallet_id === loggedUserWalletId;

    const formattedAmount = isSender ? `- $${amount.toLocaleString()}` : `+ $${amount.toLocaleString()}`;
    const amountColorClass = isSender ? 'text-error' : 'text-success';

    if (compact) {
        return (
            <div className="grid grid-cols-12 gap-2 items-center p-3 border-b border-base-200 bg-base-100 hover:bg-base-200/50 transition-colors text-sm">
                <div className="col-span-3 font-mono text-xs text-base-content/70 truncate" title={hash}>
                    {hash ? hash.slice(0, 16) + '...' : '...'}
                </div>
                <div className="col-span-4 truncate">
                    <span className="text-base-content/70">de </span>
                    <span className="font-mono text-xs">{sender_wallet_id || '...'}</span>
                    <span className="text-base-content/70 mx-1">→</span>
                    <span className="font-mono text-xs">{receiver_wallet_id || '...'}</span>
                </div>
                <div className="col-span-3 text-right font-medium">
                    ${amount.toLocaleString()}
                </div>
                <div className="col-span-2 text-right">
                    <span className={`badge badge-sm ${status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                        {status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                    </span>
                </div>
            </div>
        );
    }

    const title = isSender ? `Transferencia a ${receiver_wallet_id}` : `Transferencia de ${sender_wallet_id}`;
    const iconBgClass = isSender ? 'bg-error/10 text-error' : 'bg-success/10 text-success';

    return (
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-100 hover:bg-base-200/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${iconBgClass}`}>
                    {isSender ? '↗' : '↙'}
                </div>

                <div className="flex flex-col">
                    <span className="font-bold text-base-content">{title}</span>
                    {descrip && (
                        <span className="text-sm text-base-content/70 mt-0.5">{descrip}</span>
                    )}
                </div>
            </div>

            <div className={`font-bold text-lg ${amountColorClass}`}>
                {formattedAmount}
            </div>
        </div>
    );
}