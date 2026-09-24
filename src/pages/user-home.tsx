import { Spinner } from "@/components/ui/spinner";
import type { Task } from "@/types";
import { ClipboardTextIcon, UserCircleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

function UserHome() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLead, setIsLead] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log(tasks);

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(
                    "http://localhost:3000/api/tasks/get-user-tasks",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const result = await response.json();
                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to fetch tasks");
                }
                setIsLead(result.data.isLead);
                setTasks(result.data.tasks);
            } catch (error) {
                console.error("Failed to fetch user tasks:", error);
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Something went wrong while fetching tasks.");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <Spinner />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex min-h-75 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-black">
                        Something went wrong
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">{error}</p>
                </div>
            </div>
        );
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
        return (
            <div className="flex min-h-75 items-center justify-center">
                <div className="max-w-md text-center">
                    <div className="mb-4 flex justify-center mt-44">
                        <ClipboardTextIcon
                            size={42}
                            weight="regular"
                            className="text-neutral-400"
                        />
                    </div>

                    <h2 className="text-xl font-semibold text-black">
                        No tasks yet
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                        You don't have any tasks assigned to you yet.
                    </p>
                </div>
            </div>
        );
    }
    return <div>UserHome</div>;
}

export default UserHome;
