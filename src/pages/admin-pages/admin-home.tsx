import { useEffect } from "react";
import { ListIcon, UserPlusIcon, UsersIcon } from "@phosphor-icons/react";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import DashboardStatsCard from "@/components/dashboard-stats-card";
import { useAdminHomeStore } from "@/store/admin-store/admin-home-store";

function AdminHome() {
    const stats = useAdminHomeStore((state) => state.stats);
    const loading = useAdminHomeStore((state) => state.loading);
    const error = useAdminHomeStore((state) => state.error);
    const fetchStats = useAdminHomeStore((state) => state.fetchStats);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);


    if (loading) {
        return <LoadingUi />;
    }
    if (error || !stats) {
        return (
            <ErrorUi
                errorMessage={error || "Failed to load stats data"}
                errorDescription="Error in getting admin dashboard stats"
            />
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
                <DashboardStatsCard
                    heading="Total Leads"
                    count={stats.totalLeads}
                    line="Active leads in the system"
                    icon={UserPlusIcon}
                />
                <DashboardStatsCard
                    heading="Staff Members"
                    count={stats.totalStaff}
                    line="Registered staff members"
                    icon={UsersIcon}
                />
                <DashboardStatsCard
                    heading="Total Tasks"
                    count={stats.totalTasks}
                    line="Tasks across all leads"
                    icon={ListIcon}
                />
            </div>
            <div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">Task Overview</h2>
                    <p className="text-sm text-muted-foreground">
                        Current status of all tasks.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <DashboardStatsCard
                        heading="Pending"
                        count={stats.pendingTasks}
                        line="Tasks waiting to be started"
                        icon={ListIcon}
                    />
                    <DashboardStatsCard
                        heading="In Progress"
                        count={stats.inProgressTasks}
                        line="Tasks currently being worked on"
                        icon={ListIcon}
                    />
                    <DashboardStatsCard
                        heading="Completed"
                        count={stats.completedTasks}
                        line="Successfully completed tasks"
                        icon={ListIcon}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminHome;
