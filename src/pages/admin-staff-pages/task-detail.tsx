import { useEffect } from "react";
import { useParams } from "react-router";
import type { User } from "@/types";
import { useAuthStore } from "@/store/authStore";
import TaskDetailHeader from "@/components/task-detail/task-detail-header";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import TaskDetailMainSection from "@/components/task-detail/task-detail-main-section";
import { useTaskDetailStore } from "@/store/admin-staff-store/task-detail-store";

function TaskDetail() {
    const { taskId } = useParams();
    const user = useAuthStore((state) => state.user) as User;

    const task = useTaskDetailStore((state) => state.task);
    const loading = useTaskDetailStore((state) => state.loading);
    const error = useTaskDetailStore((state) => state.error);
    const fetchTask = useTaskDetailStore((state) => state.fetchTask);

    useEffect(() => {
        if (!taskId) {
            return;
        }

        fetchTask(taskId);
    }, [taskId, fetchTask]);

    
    if (loading) {
        return <LoadingUi />;
    }
    if (error || !task) {
        return (
            <ErrorUi
                errorMessage={error}
                errorDescription="Failed to get task details"
            />
        );
    }
    return (
        <div className="min-h-screen bg-white px-6 py-8 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">
                <TaskDetailHeader task={task} />

                <TaskDetailMainSection role={user.role} task={task} />

                {/* Task identifiers */}
                <div className="mt-6 rounded-2xl border border-black/10 bg-black/2 p-5">
                    <div className="flex flex-col gap-2 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            Task ID:{" "}
                            <span className="font-medium text-black/60">
                                {task.id}
                            </span>
                        </span>

                        <span>
                            Lead ID:{" "}
                            <span className="font-medium text-black/60">
                                {task.leadId}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetail;
