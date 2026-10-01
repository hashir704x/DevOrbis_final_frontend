import { useEffect } from "react";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import EmptyTaskUi from "@/components/empty-task-ui";
import StaffTasksCard from "@/components/staff-tasks/staff-task-card";
import { useStaffTasksStore } from "@/store/staff-store/staff-tasks-store";

function StaffTasks() {
    const tasks = useStaffTasksStore((state) => state.tasks);
    const loading = useStaffTasksStore((state) => state.loading);
    const error = useStaffTasksStore((state) => state.error);
    const fetchTasks = useStaffTasksStore((state) => state.fetchTasks);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (loading) {
        return <LoadingUi />;
    }
    if (error) {
        return (
            <ErrorUi errorMessage={error} errorDescription="Failed to load tasks" />
        );
    }
    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">My Tasks</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Keep track of the tasks assigned to you.
                </p>
            </div>

            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Assigned Tasks</h2>

                    <p className="text-sm text-muted-foreground">
                        Tasks currently assigned to you.
                    </p>
                </div>

                {tasks.length === 0 ? (
                    <EmptyTaskUi />
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {tasks.map((task) => (
                            <StaffTasksCard task={task} key={task.id} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default StaffTasks;
