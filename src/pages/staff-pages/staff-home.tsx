import { useEffect } from "react";
import {
    ListIcon,
    ClockIcon,
    CheckCircleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import DashboardStatsCard from "@/components/dashboard-stats-card";
import { useStaffHomeStore } from "@/store/staff-store/staff-home-store";

function StaffHome() {
    const stats = useStaffHomeStore((state) => state.stats);
    const loading = useStaffHomeStore((state) => state.loading);
    const error = useStaffHomeStore((state) => state.error);
    const fetchStats = useStaffHomeStore((state) => state.fetchStats);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return <LoadingUi />;
    }

    if (error || !stats) {
        return (
            <ErrorUi
                errorMessage={error || "Failed to get staff's stats data"}
                errorDescription="Unable to load staff dashboard"
            />
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
                <DashboardStatsCard
                    heading="Total Tasks"
                    count={stats.totalTasks}
                    line="Tasks assigned to you"
                    icon={ListIcon}
                />
                <DashboardStatsCard
                    heading="Pending"
                    count={stats.pendingTasks}
                    line="Tasks waiting to be started"
                    icon={WarningCircleIcon}
                />
                <DashboardStatsCard
                    heading="In Progress"
                    count={stats.inProgressTasks}
                    line="Tasks currently being worked on"
                    icon={ClockIcon}
                />
                <DashboardStatsCard
                    heading="Completed"
                    count={stats.completedTasks}
                    line="Successfully completed tasks"
                    icon={CheckCircleIcon}
                />
            </div>
        </div>
    );
}

export default StaffHome;
