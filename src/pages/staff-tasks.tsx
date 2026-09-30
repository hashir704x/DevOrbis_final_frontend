import type { TaskStaff } from "@/types";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/utils/backend-url";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowSquareOutIcon,
    CalendarBlankIcon,
    ClipboardTextIcon,
    FlagIcon,
    ListChecksIcon,
    PencilSimpleIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router";
import {
    formatDate,
    getPriorityLabel,
    getStatusIcon,
    getStatusLabel,
} from "@/utils/task-formatters";

function StaffTasks() {
    const [tasks, setTasks] = useState<TaskStaff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${BACKEND_URL}/api/tasks/get-staff-tasks`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to fetch tasks");
                }

                setTasks(result.data);
            } catch (error) {
                console.error("Failed to fetch staff tasks:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading your tasks.",
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Spinner className="size-7" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-4">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-semibold">
                            Unable to load tasks
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">My Tasks</h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Keep track of the tasks assigned to you.
                </p>
            </div>

            {/* Assigned Tasks */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Assigned Tasks</h2>

                    <p className="text-sm text-muted-foreground">
                        Tasks currently assigned to you.
                    </p>
                </div>

                {tasks.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-40 items-center justify-center">
                            <div className="text-center">
                                <ListChecksIcon className="mx-auto size-8 text-muted-foreground" />

                                <p className="mt-3 font-medium">No tasks assigned</p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    You currently don't have any assigned tasks.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex flex-col gap-6 p-6 lg:p-7">
                                    {/* Status + Priority */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-muted/40 px-3 py-1.5 text-xs font-medium">
                                            {getStatusIcon(task.status)}

                                            <span>
                                                {getStatusLabel(task.status)}
                                            </span>
                                        </div>

                                        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-muted/40 px-3 py-1.5 text-xs font-medium">
                                            <FlagIcon className="size-3.5" />

                                            <span>
                                                {getPriorityLabel(task.priority)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <h3 className="text-xl font-semibold tracking-tight">
                                            {task.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                            {task.description}
                                        </p>
                                    </div>

                                    {/* Lead */}
                                    <div className="rounded-xl border border-black/10 bg-muted/30 p-4">
                                        <div className="flex items-center gap-2">
                                            <ClipboardTextIcon className="size-4 text-muted-foreground" />

                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Lead
                                            </p>
                                        </div>

                                        <p className="mt-1 font-medium">
                                            {task.leadName}
                                        </p>
                                    </div>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-4 border-t border-black/10 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {getStatusIcon(task.status)}

                                            <span>
                                                {getStatusLabel(task.status)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarBlankIcon className="size-4" />

                                            <span>{formatDate(task.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 border-t border-black/10 pt-5">
                                        <Link
                                            to={`/staff-admin/task-detail/${task.id}`}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black/80"
                                        >
                                            <ArrowSquareOutIcon className="size-4" />
                                            Open
                                        </Link>

                                        <Link
                                            to={`/staff-admin/edit-task/${task.id}`}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                                        >
                                            <PencilSimpleIcon className="size-4" />
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default StaffTasks;
