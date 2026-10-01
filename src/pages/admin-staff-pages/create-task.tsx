import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";
import { useEffect, useState } from "react";
import { CreateTaskWithAi } from "@/components/create-task/create-task-with-ai";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import CreateTaskForm from "@/components/create-task-form";
import { useCreateTaskStore } from "@/store/admin-staff-store/create-task-store";

function CreateTask() {
    const user = useAuthStore((state) => state.user) as User;
    const role = user.role;

    const leads = useCreateTaskStore((state) => state.leads);
    const staff = useCreateTaskStore((state) => state.staff);
    const loading = useCreateTaskStore((state) => state.loading);
    const error = useCreateTaskStore((state) => state.error);
    const fetchTaskData = useCreateTaskStore((state) => state.fetchTaskData);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

    useEffect(() => {
        fetchTaskData(role);
    }, [fetchTaskData, role]);

    if (loading) {
        return <LoadingUi />;
    }

    if (error) {
        return (
            <ErrorUi
                errorMessage={error}
                errorDescription="Failed to load task data"
            />
        );
    }
    return (
        <div className="mx-auto w-full max-w-3xl py-2">
            <div className="mb-4 flex items-center justify-between px-6">
                <h1 className="text-xl font-medium">Create a new Task for leads</h1>

                <CreateTaskWithAi
                    setDescription={setDescription}
                    setPriority={setPriority}
                    setTitle={setTitle}
                />
            </div>

            {/* Form Card */}
            <CreateTaskForm
                description={description}
                leads={leads}
                priority={priority}
                role={role}
                setDescription={setDescription}
                setPriority={setPriority}
                setTitle={setTitle}
                staff={staff}
                title={title}
            />
        </div>
    );
}

export default CreateTask;
