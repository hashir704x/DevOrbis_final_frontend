import type { AdminDashboardStats } from "@/types";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/utils/backend-url";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    ListIcon,
    UserPlusIcon,
    UsersIcon,
} from "@phosphor-icons/react";

function AdminHome() {
    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${BACKEND_URL}/api/admin/get-dashboard-stats`,
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
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your team's leads, staff, and tasks.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Total Leads
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                {stats.totalLeads}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Active leads in the system
                            </p>
                        </div>

                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <UserPlusIcon className="size-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Staff Members
                            </p>

                            <p className="mt-2 text-3xl font-bold tracking-tight">
                                {stats.totalStaff}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Registered staff members
                            </p>
                        </div>

                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <UsersIcon className="size-6" />
                        </div>
                    </CardContent>
                </Card>

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
                                Tasks across all leads
                            </p>
                        </div>

                        <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                            <ListIcon className="size-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Task Overview */}
            <div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Task Overview</h2>
                    <p className="text-sm text-muted-foreground">
                        Current status of all tasks.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.pendingTasks}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Tasks waiting to be started
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">
                                In Progress
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.inProgressTasks}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Tasks currently being worked on
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">
                                Completed
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <p className="text-3xl font-bold">
                                {stats.completedTasks}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                                Successfully completed tasks
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
