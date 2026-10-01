import { formatNumber } from "@/utils/ai-usage-formatters";
import type { Icon } from "@phosphor-icons/react";

function AiUsageCard({
    icon: IconComponent,
    label,
    count,
    line,
    heading,
    cost,
}: {
    icon: Icon;
    label: string;
    heading: string;
    count?: number;
    cost?: string;
    line: string;
}) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-black text-white">
                    <IconComponent size={22} weight="bold" />
                </div>
                <span className="rounded-full bg-black/4 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-black/45">
                    {label}
                </span>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                {heading}
            </p>
            {count && (
                <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                    {formatNumber(count)}
                </p>
            )}
            {cost && (
                <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
                    {cost}
                </p>
            )}
            <p className="mt-2 text-sm text-black/45">{line}</p>
        </div>
    );
}

export default AiUsageCard;
