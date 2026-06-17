interface SummaryCardProps {
    title: string,
    amount: number | null,
    icon: React.ElementType,
    textStyle: string,
    info: string,
}
export default function SummaryCard({title, amount, icon: Icon, textStyle, info}: SummaryCardProps) {
    return (
        <div className="stat relative">
            <div className={`stat-figure ${textStyle}`}>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-inner shadow-emerald-500/10 backdrop-blur-sm">
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            <div className="stat-title text-sm font-medium text-base-content/60 tracking-wide uppercase">{title}</div>
            <div className={`stat-value text-3xl md:text-4xl mt-1 font-bold tracking-tight ${textStyle}`}>
                {amount === null ? (
                    <span className="loading loading-dots loading-md text-emerald-400"></span>
                ) : (
                    `$${amount.toLocaleString()}`
                )}
            </div>
            <div className="stat-desc text-xs mt-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                {info}
            </div>
        </div>
    );
}