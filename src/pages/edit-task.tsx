import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    CheckIcon,
    ClipboardTextIcon,
    TrashIcon,
    UserCircleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { updateTaskSchema } from "@/zod-schemas/task-schema";
import type { Staff, TaskDetail } from "@/types";
import { toast } from "@/components/ui/toast";
import { getPriorityLabel, getStatusLabel } from "@/utils/task-formatters";
import { BACKEND_URL } from "@/utils/backend-url";
import DeleteTaskDialog from "@/components/edit-task/delete-task-dialog";

function EditTask() {
    const user = useAuthStore((state) => state.user) as User;
    const { taskId } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState<TaskDetail | null>(null);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
    const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(
        "pending",
    );
    const [assignedTo, setAssignedTo] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        (async function () {
            if (!taskId) {
                setError("Invalid task ID.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError("");
                const taskResponse = await fetch(
                    `${BACKEND_URL}/api/tasks/get-task-detail/${taskId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const taskData = await taskResponse.json();
                if (!taskResponse.ok) {
                    throw new Error(
                        taskData.message || "Failed to fetch task details.",
                    );
                }
                const taskDetails: TaskDetail = taskData.data;
                setTask(taskDetails);
                setTitle(taskDetails.title);
                setDescription(taskDetails.description);
                setPriority(taskDetails.priority);
                setStatus(taskDetails.status);
                setAssignedTo(taskDetails.assignedTo);
                if (user.role === "admin") {
                    const staffResponse = await fetch(
                        `${BACKEND_URL}/api/staff/get-all-staff`,
                        {
                            method: "GET",
                            credentials: "include",
                        },
                    );
                    const staffData = await staffResponse.json();
                    if (!staffResponse.ok) {
                        throw new Error(
                            staffData.message || "Failed to fetch staff members.",
                        );
                    }
                    setStaff(staffData.data);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Something went wrong while getting the task details.");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [taskId, user.role]);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!taskId) {
            return;
        }
        try {
            setSaving(true);
            const body = {
                title,
                description,
                priority,
                status,
                assignedTo,
            };
            const validationResult = updateTaskSchema.safeParse(body);
            if (!validationResult.success) {
                toast.add({
                    type: "error",
                    description:
                        validationResult.error.issues[0]?.message ||
                        "Invalid task data.",
                });
                return;
            }
            const response = await fetch(
                `${BACKEND_URL}/api/tasks/edit-task/${taskId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(validationResult.data),
                },
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update task.");
            }
            toast.add({
                type: "success",
                description: "Task updated successfully.",
            });
            navigate(`/staff-admin/task-detail/${taskId}`);
        } catch (error) {
            if (error instanceof Error) {
                toast.add({
                    type: "error",
                    description: error.message,
                });
            } else {
                toast.add({
                    type: "error",
                    description: "Something went wrong while updating the task.",
                });
            }
        } finally {
            setSaving(false);
        }
    }

    const handleDeleteTask = async () => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/tasks/delete-task/${taskId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to delete task");
            }
            toast.add({
                type: "success",
                description: "Task deleted successfully.",
            });
            setDeleteDialogOpen(false);
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/staff");
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
            if (error instanceof Error) {
                toast.add({
                    type: "error",
                    description: error.message,
                });
            } else {
                toast.add({
                    type: "error",
                    description: "Something went wrong while deleting the task.",
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Spinner className="size-7" />
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center px-6">
                <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-black text-white">
                        <WarningCircleIcon size={28} weight="bold" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-black">
                        Unable to load task
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-black/55">
                        {error || "The requested task could not be found."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-6 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="overflow-hidden rounded-3xl border-2">
                    <div className="p-7">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border  px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em]">
                            <ClipboardTextIcon size={14} weight="bold" />
                            Task management
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            Edit task
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6">
                            Update the task information, progress, priority, and
                            assignment.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {/* Task information */}
                    <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-black/10 p-6">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                                01
                            </div>

                            <div>
                                <h2 className="font-semibold text-black">
                                    Task information
                                </h2>

                                <p className="text-sm text-black/45">
                                    Update the core information for this task.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5 p-6">
                            <div>
                                <label
                                    htmlFor="title"
                                    className="mb-2 block text-sm font-medium text-black"
                                >
                                    Task title
                                </label>

                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="Enter task title"
                                    className="h-11"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="description"
                                    className="mb-2 block text-sm font-medium text-black"
                                >
                                    Description
                                </label>

                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Describe the task..."
                                    className="min-h-32 resize-none"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Status and priority */}
                    <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-black/10 p-6">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                                02
                            </div>

                            <div>
                                <h2 className="font-semibold text-black">
                                    Task progress
                                </h2>

                                <p className="text-sm text-black/45">
                                    Update the current status and priority.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 p-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-black">
                                    Status
                                </label>

                                <Select
                                    value={status}
                                    onValueChange={(value) => {
                                        if (value !== null) {
                                            setStatus(value as TaskDetail["status"]);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue>
                                            {getStatusLabel(status)}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>

                                        <SelectItem value="in_progress">
                                            In progress
                                        </SelectItem>

                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-black">
                                    Priority
                                </label>

                                <Select
                                    value={priority}
                                    onValueChange={(value) => {
                                        if (value !== null) {
                                            setPriority(
                                                value as TaskDetail["priority"],
                                            );
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-11">
                                        <SelectValue>
                                            {getPriorityLabel(priority)}
                                        </SelectValue>
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>

                                        <SelectItem value="medium">
                                            Medium
                                        </SelectItem>

                                        <SelectItem value="high">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </section>

                    {/* Assignment */}
                    <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-black/10 p-6">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                                03
                            </div>

                            <div>
                                <h2 className="font-semibold text-black">
                                    Assignment
                                </h2>

                                <p className="text-sm text-black/45">
                                    Manage who is responsible for this task.
                                </p>
                            </div>
                        </div>

                        <div className="p-6">
                            {user.role === "admin" ? (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-black">
                                        Assigned staff member
                                    </label>

                                    <Select
                                        value={assignedTo}
                                        onValueChange={(value) => {
                                            if (value !== null) {
                                                setAssignedTo(value);
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Select a staff member">
                                                {assignedTo
                                                    ? staff.find(
                                                          (member) =>
                                                              member.id ===
                                                              assignedTo,
                                                      )?.username
                                                    : "Select a staff member"}
                                            </SelectValue>
                                        </SelectTrigger>

                                        <SelectContent>
                                            {staff.map((member) => (
                                                <SelectItem
                                                    key={member.id}
                                                    value={member.id}
                                                >
                                                    {member.username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 rounded-xl border border-black/10 bg-black/2.5 p-4">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                                        <UserCircleIcon size={22} weight="duotone" />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-black/40">
                                            Assigned to
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-black">
                                            You
                                        </p>

                                        <p className="mt-0.5 text-xs text-black/45">
                                            Staff members cannot reassign tasks.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/2.5 px-5 py-4">
                        <UserCircleIcon
                            size={20}
                            weight="duotone"
                            className="text-black/50"
                        />

                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/35">
                                Associated lead
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-black">
                                {task.leadName}
                            </p>
                        </div>
                    </div>

                    <div>
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
                            onConfirm={handleDeleteTask}
                        />
                    </div>

                    {/* Save bar */}
                    <div className="flex flex-col gap-4 rounded-2xl bg-black p-5 text-white sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold">
                                Ready to save changes?
                            </p>

                            <p className="mt-1 text-xs text-white/50">
                                Your changes will update this task immediately.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={saving}
                            className="h-11 gap-2 bg-white px-6 font-semibold text-black hover:bg-white/90"
                        >
                            {saving ? (
                                <>
                                    <Spinner className="size-4" />
                                    Saving
                                </>
                            ) : (
                                <>
                                    <CheckIcon size={18} weight="bold" />
                                    Save changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTask;
