import { UserCircleIcon } from "@phosphor-icons/react";
import { useEffect } from "react";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import EmptyTaskUi from "@/components/empty-task-ui";
import UserTaskCard from "@/components/user-home/user-task-card";
import { useUserHomeStore } from "@/store/user-store/user-home-store";

function UserHome() {
    const tasks = useUserHomeStore((state) => state.tasks);
    const isLead = useUserHomeStore((state) => state.isLead);
    const loading = useUserHomeStore((state) => state.loading);
    const error = useUserHomeStore((state) => state.error);
    const fetchTasks = useUserHomeStore((state) => state.fetchTasks);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (loading) {
        return <LoadingUi />;
    }
    if (error) {
        return <ErrorUi errorMessage={error} />;
    }
    if (!isLead) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="mb-4 flex justify-center mt-44">
                        <UserCircleIcon
                            size={42}
                            weight="regular"
                            className="text-neutral-400"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-black">
                        You're not a CodeNest lead yet
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                        Task information is available for CodeNest leads. Once you
                        become a lead, your assigned tasks will appear here.
                    </p>
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return <EmptyTaskUi />;
    }
    return (
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-black">My Tasks</h1>

                <p className="mt-1 text-sm text-neutral-500">
                    Track the tasks related to your project.
                </p>
            </div>
            <div className="space-y-4">
                {tasks.map((task) => (
                    <UserTaskCard task={task} key={task.id} />
                ))}
            </div>
        </div>
    );
}

export default UserHome;
