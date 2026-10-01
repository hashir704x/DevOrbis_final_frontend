import type { TaskStaff } from "@/types";
import {
    formatDate,
    getPriorityLabel,
    getStatusIcon,
    getStatusLabel,
} from "@/utils/task-formatters";
import {
    ArrowSquareOutIcon,
    CalendarBlankIcon,
    ClipboardTextIcon,
    FlagIcon,
    PencilSimpleIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router";

function StaffTasksCard({ task }: { task: TaskStaff }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-col gap-6 p-6 lg:p-7">
                {/* Status + Priority */}
                <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-muted/40 px-3 py-1.5 text-xs font-medium">
                        {getStatusIcon(task.status)}

                        <span>{getStatusLabel(task.status)}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-muted/40 px-3 py-1.5 text-xs font-medium">
                        <FlagIcon className="size-3.5" />
                        <span>{getPriorityLabel(task.priority)}</span>
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

                    <p className="mt-1 font-medium">{task.leadName}</p>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 border-t border-black/10 pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {getStatusIcon(task.status)}

                        <span>{getStatusLabel(task.status)}</span>
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
    );
}

export default StaffTasksCard;
