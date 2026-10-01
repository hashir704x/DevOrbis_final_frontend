import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { TrashIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import DeleteTaskDialog from "@/components/edit-task/delete-task-dialog";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import EditTaskHeader from "@/components/edit-task/edit-task-header";
import EditTaskForm from "@/components/edit-task/edit-task-form";
import { useEditTaskStore } from "@/store/admin-staff-store/edit-task-store";

function EditTask() {
    const user = useAuthStore((state) => state.user) as User;
    const { taskId } = useParams();

    const task = useEditTaskStore((state) => state.task);
    const staff = useEditTaskStore((state) => state.staff);
    const loading = useEditTaskStore((state) => state.loading);
    const error = useEditTaskStore((state) => state.error);
    const fetchTaskData = useEditTaskStore((state) => state.fetchTaskData);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(
        "pending",
    );

    const [assignedTo, setAssignedTo] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (!taskId) {
            return;
        }

        fetchTaskData(taskId, user.role);
    }, [taskId, user.role, fetchTaskData]);

    useEffect(() => {
        if (!task) {
            return;
        }

        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setStatus(task.status);
        setAssignedTo(task.assignedTo);
    }, [task]);

    if (loading) {
        return <LoadingUi />;
    }

    if (error || !task || !taskId) {
        return (
            <ErrorUi
                errorMessage={error}
                errorDescription="Failed to get data of the task"
            />
        );
    }

    return (
        <div className="min-h-screen bg-white px-6 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">
                <EditTaskHeader />
                <div className="mt-6 ml-3">
                    <Button
                        className="p-4 border-red-500 cursor-pointer"
                        type="button"
                        variant="destructive"
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        <TrashIcon className="size-4" />
                        Delete Task
                    </Button>

                    <DeleteTaskDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                        role={user.role}
                        setDeleteDialogOpen={setDeleteDialogOpen}
                        taskId={taskId}
                    />
                </div>

                <div>
                    <EditTaskForm
                        role={user.role}
                        assignedTo={assignedTo}
                        description={description}
                        priority={priority}
                        setAssignedTo={setAssignedTo}
                        setDescription={setDescription}
                        setPriority={setPriority}
                        setStatus={setStatus}
                        setTitle={setTitle}
                        staff={staff}
                        status={status}
                        task={task}
                        taskId={taskId}
                        title={title}
                    />
                </div>
            </div>
        </div>
    );
}

export default EditTask;
