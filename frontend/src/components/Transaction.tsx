import type { TransactionItemProps } from '../types/TransactionTypes.tsx'

export default function Transaction({ transaction, loggedUserWalletId }: TransactionItemProps) {
    const { amount, sender, receiver, description } = transaction;

    const isSender = loggedUserWalletId !== null && sender === loggedUserWalletId;

    const title = isSender ? `Transferencia a ${receiver}` : `Transferencia de ${sender}`;
    const formattedAmount = isSender ? `- $${amount.toLocaleString()}` : `+ $${amount.toLocaleString()}`;
    const amountColorClass = isSender ? 'text-error' : 'text-success';
    const iconBgClass = isSender ? 'bg-error/10 text-error' : 'bg-success/10 text-success';

    return (
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-100 hover:bg-base-200/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${iconBgClass}`}>
                    {isSender ? '↗' : '↙'}
                </div>

                <div className="flex flex-col">
                    <span className="font-bold text-base-content">{title}</span>
                    {description && (
                        <span className="text-sm text-base-content/70 mt-0.5">{description}</span>
                    )}
                </div>
            </div>

            <div className={`font-bold text-lg ${amountColorClass}`}>
                {formattedAmount}
            </div>
        </div>
    );
}