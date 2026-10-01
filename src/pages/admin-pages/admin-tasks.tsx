import { useEffect } from "react";
import { ClipboardTextIcon } from "@phosphor-icons/react";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import EmptyTaskUi from "@/components/empty-task-ui";
import AdminTaskCard from "@/components/admin-tasks/admin-task-card";
import { useAdminTasksStore } from "@/store/admin-store/admin-tasks-store";

function AdminTasks() {
    const tasks = useAdminTasksStore((state) => state.tasks);
    const loading = useAdminTasksStore((state) => state.loading);
    const error = useAdminTasksStore((state) => state.error);
    const fetchTasks = useAdminTasksStore((state) => state.fetchTasks);
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (loading) {
        return <LoadingUi />;
    }
    if (error) {
        return (
            <ErrorUi
                errorMessage={error}
                errorDescription="Failed to load tasks data for admin"
            />
        );
    }

    if (tasks.length === 0) {
        return <EmptyTaskUi />;
    }
    return (
        <div className="min-h-screen bg-white px-6 py-4 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                            All Tasks
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-black/55">
                            Monitor tasks across leads, assignments, priorities, and
                            current progress.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-black px-4 py-3 text-sm font-medium text-white">
                        <ClipboardTextIcon size={18} weight="bold" />
                        <span>
                            {tasks.length}
                            {tasks.length === 1 ? "task" : "tasks"}
                        </span>
                    </div>
                </div>
                <div className="grid gap-5">
                    {tasks.map((task) => (
                        <AdminTaskCard task={task} key={task.id} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminTasks;
