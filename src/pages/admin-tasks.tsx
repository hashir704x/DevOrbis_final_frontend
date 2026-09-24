import { useEffect, useState } from "react";
import {
    ArrowSquareOutIcon,
    CalendarBlankIcon,
    ClipboardTextIcon,
    FlagIcon,
    PencilSimpleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import type { TaskAdmin } from "@/types";
import { Link } from "react-router";
import {
    formatDate,
    getPriorityLabel,
    getStatusIcon,
    getStatusLabel,
} from "@/utils/task-formatters";

function AdminTasks() {
    const [tasks, setTasks] = useState<TaskAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(
                    "http://localhost:3000/api/tasks/get-admin-tasks",
                    { method: "GET", credentials: "include" },
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch tasks");
                }
                setTasks(data.data);
            } catch (error) {
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
            <div className="flex min-h-[70vh] items-center justify-center">
                <Spinner className="size-7" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-6">
                <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-black text-white">
                        <WarningCircleIcon size={28} weight="bold" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-black">
                        Unable to load tasks
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-black/55">{error}</p>
                </div>
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="min-h-[70vh] px-6 py-10">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-3xl border border-black/10 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-black text-white">
                            <ClipboardTextIcon size={32} weight="duotone" />
                        </div>
                        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-black">
                            No tasks yet
                        </h1>
                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/55">
                            There are currently no tasks in the system. Once tasks
                            are created for leads, they will appear here.
                        </p>
                    </div>
                </div>
            </div>
        );
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
                        <div
                            key={task.id}
                            className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="flex flex-col gap-6 p-6 lg:p-7">
                                {/* Top section */}
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="mb-3 flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                                                <span className="size-1.5 rounded-full bg-white" />
                                                {getStatusLabel(task.status)}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/3 px-3 py-1 text-xs font-medium text-black">
                                                <FlagIcon size={13} weight="bold" />
                                                {getPriorityLabel(task.priority)}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-semibold tracking-tight text-black">
                                            {task.title}
                                        </h2>
                                        <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
                                            {task.description}
                                        </p>
                                    </div>
                                    {/* Lead */}
                                    <div className="shrink-0 rounded-xl border border-black/10 bg-black/2.5 px-4 py-3 lg:min-w-52">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/40">
                                            Lead
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-black">
                                            {task.leadName}
                                        </p>
                                    </div>
                                </div>
                                {/* Bottom metadata + actions */}
                                <div className="flex flex-col gap-5 border-t border-black/10 pt-5 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-black/55">
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-8 items-center justify-center rounded-lg bg-black text-white">
                                                {getStatusIcon(task.status)}
                                            </span>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wide text-black/35">
                                                    Status
                                                </p>
                                                <p className="font-medium text-black">
                                                    {getStatusLabel(task.status)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-8 items-center justify-center rounded-lg bg-black text-white">
                                                <CalendarBlankIcon
                                                    size={16}
                                                    weight="bold"
                                                />
                                            </span>
                                            <div>
                                                <p className="text-[11px] uppercase tracking-wide text-black/35">
                                                    Created
                                                </p>
                                                <p className="font-medium text-black">
                                                    {formatDate(task.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/staff-admin/task-detail/${task.id}`}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-black/15 bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
                                        >
                                            <ArrowSquareOutIcon
                                                size={17}
                                                weight="bold"
                                            />
                                            Open
                                        </Link>
                                        <Link
                                            to={`/staff-admin/edit-task/${task.id}`}
                                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-black/80"
                                        >
                                            <PencilSimpleIcon
                                                size={17}
                                                weight="bold"
                                            />
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminTasks;
