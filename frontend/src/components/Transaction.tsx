import type { TransactionItemProps } from '../types/TransactionTypes.tsx'

export default function Transaction({ transaction, loggedUserId }: TransactionItemProps) {
    const { amount, sender, receiver, timestamp, description, status } = transaction;

    const isSender = sender.id === loggedUserId;

    const title = isSender ? `Transferencia a ${receiver.name}` : `Transferencia de ${sender.name}`;
    const formattedAmount = isSender ? `- $${amount.toLocaleString()}` : `+ $${amount.toLocaleString()}`;

    const amountColorClass = isSender ? 'text-error' : 'text-success';
    const iconBgClass = isSender ? 'bg-error/10 text-error' : 'bg-success/10 text-success';

    const opacityClass = status === 'PENDING' ? 'opacity-60' : 'opacity-100';
    const strikeThroughClass = status === 'FAILED' ? 'line-through text-error opacity-70' : '';

    return (
        <div className={`flex items-center justify-between p-4 border-b border-base-200 bg-base-100 hover:bg-base-200/50 transition-colors ${opacityClass}`}>

            <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${iconBgClass}`}>
                    {isSender ? '↗' : '↙'}
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-base-content">{title}</span>
                        {status === 'PENDING' && <span className="badge badge-ghost badge-sm">Pendiente</span>}
                        {status === 'FAILED' && <span className="badge badge-error badge-sm">Falló</span>}
                    </div>

                    {description && (
                        <span className="text-sm text-base-content/70 mt-0.5">
              {description}
            </span>
                    )}

                    <span className="text-xs text-base-content/50 mt-1">
            {timestamp.toLocaleDateString()} - {timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
                </div>
            </div>

            <div className={`font-bold text-lg ${strikeThroughClass || amountColorClass} ${status === 'PENDING' ? 'text-base-content/60' : ''}`}>
                {formattedAmount}
            </div>

        </div>
    );
}