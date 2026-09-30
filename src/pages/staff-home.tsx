import type { StaffDashboardStats } from "@/types";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/utils/backend-url";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    ListIcon,
    ClockIcon,
    CheckCircleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";

function StaffHome() {
    const [stats, setStats] = useState<StaffDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${BACKEND_URL}/api/staff/get-dashboard-stats`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to fetch dashboard stats",
                    );
                }

                setStats(result.data);
            } catch (error) {
                console.error("Dashboard stats error:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading the dashboard",
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Spinner className="size-8" />
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Unable to load dashboard</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {error || "Dashboard statistics could not be loaded."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Staff Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your assigned tasks and their current status.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Tasks
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                {stats.totalTasks}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Tasks assigned to you
                            </p>
                        </div>

                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <ListIcon className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Pending
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                {stats.pendingTasks}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Tasks waiting to be started
                            </p>
                        </div>

                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <WarningCircleIcon className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                In Progress
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                {stats.inProgressTasks}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Tasks currently being worked on
                            </p>
                        </div>

                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <ClockIcon className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Completed
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                {stats.completedTasks}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Successfully completed tasks
                            </p>
                        </div>

                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <CheckCircleIcon className="size-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default StaffHome;
