import type { TaskDetail, TaskStaff } from "@/types";
import { CheckCircleIcon, ClockIcon } from "@phosphor-icons/react";

export function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function formatDateTime(date: string) {
    return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function getStatusLabel(status: TaskDetail["status"]) {
    if (status === "in_progress") {
        return "In progress";
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getStatusIcon(status: TaskDetail["status"]) {
    if (status === "completed") {
        return <CheckCircleIcon size={20} weight="fill" />;
    }
    if (status === "in_progress") {
        return <ClockIcon size={20} weight="fill" />;
    }
    return <ClockIcon size={20} />;
}

export function getPriorityLabel(priority: TaskDetail["priority"]) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function StatusBadge({ status }: { status: TaskStaff["status"] }) {
    const labels = {
        pending: "Pending",
        in_progress: "In Progress",
        completed: "Completed",
    };
    return (
        <span className="rounded-full border px-3 py-1 text-xs font-medium">
            {labels[status]}
        </span>
    );
}

export function PriorityBadge({ priority }: { priority: TaskStaff["priority"] }) {
    return (
        <span className="shrink-0 rounded-full border px-3 py-1 text-xs font-medium capitalize">
            {priority}
        </span>
    );
}
