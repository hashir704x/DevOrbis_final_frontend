import type { role, Staff, TaskDetail } from "@/types";
import { getStatusLabel, getPriorityLabel } from "@/utils/task-formatters";
import { UserCircleIcon, CheckIcon } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { updateTaskSchema } from "@/zod-schemas/task-schema";
import { toast } from "../ui/toast";
import { BACKEND_URL } from "@/utils/backend-url";
import { useNavigate } from "react-router";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

function EditTaskForm({
    taskId,
    description,
    priority,
    status,
    title,
    assignedTo,
    role,
    staff,
    task,
    setDescription,
    setTitle,
    setStatus,
    setPriority,
    setAssignedTo,
}: {
    taskId: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in_progress" | "completed";
    assignedTo: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    setStatus: React.Dispatch<
        React.SetStateAction<"pending" | "in_progress" | "completed">
    >;
    setPriority: React.Dispatch<React.SetStateAction<"low" | "medium" | "high">>;
    setAssignedTo: React.Dispatch<React.SetStateAction<string>>;
    role: role;
    staff: Staff[];
    task: TaskDetail;
}) {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

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

    return (
        <div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
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
                                onChange={(event) => setTitle(event.target.value)}
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
                                    <SelectItem value="pending">Pending</SelectItem>

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
                                        setPriority(value as TaskDetail["priority"]);
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

                                    <SelectItem value="medium">Medium</SelectItem>

                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </section>
                <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="flex items-center gap-3 border-b border-black/10 p-6">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                            03
                        </div>

                        <div>
                            <h2 className="font-semibold text-black">Assignment</h2>

                            <p className="text-sm text-black/45">
                                Manage who is responsible for this task.
                            </p>
                        </div>
                    </div>

                    <div className="p-6">
                        {role === "admin" ? (
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
                                                          member.id === assignedTo,
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
    );
}

export default EditTaskForm;
