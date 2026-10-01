import type { Icon } from "@phosphor-icons/react";
import { Card, CardContent } from "./ui/card";

function DashboardStatsCard({
    count,
    heading,
    icon: IconComponent,
    line,
}: {
    heading: string;
    count: number;
    line: string;
    icon: Icon;
}) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between p-6">
                <div>
                    <h2 className="text-sm font-medium text-muted-foreground">
                        {heading}
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight">{count}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{line}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                    <IconComponent className="size-6" />
                </div>
            </CardContent>
        </Card>
    );
}

export default DashboardStatsCard;
