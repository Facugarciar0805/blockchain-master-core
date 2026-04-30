interface SummaryCardProps {
    title: string,
    amount: number,
    icon: React.ElementType,
    textStyle: string,
    info: string,
}
export default function SummaryCard({title, amount, icon: Icon, textStyle, info}: SummaryCardProps) {
    return (
        <div className="stat">
            <div className={`stat-figure ${textStyle}`}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="stat-title">{title}</div>
            <div className={`stat-value ${textStyle}`}>$ {amount} </div>
            <div className="stat-desc">{info}</div>
        </div>
    );
}