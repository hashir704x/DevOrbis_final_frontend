import type { role, TaskDetail } from "@/types";
import {
    getStatusIcon,
    getStatusLabel,
    getPriorityLabel,
    formatDate,
    formatDateTime,
} from "@/utils/task-formatters";
import {
    FlagIcon,
    UserCircleIcon,
    ArrowSquareOutIcon,
    EnvelopeIcon,
    CalendarBlankIcon,
    ClockIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router";

function TaskDetailMainSection({ task, role }: { task: TaskDetail, role:role }) {
    return (
        <div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="border-b border-black/10 p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                            Task information
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="rounded-xl border border-black/10 bg-black/2.5 p-4">
                                <div className="flex items-center gap-2 text-black/45">
                                    {getStatusIcon(task.status)}

                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                        Status
                                    </span>
                                </div>

                                <p className="mt-2 font-semibold text-black">
                                    {getStatusLabel(task.status)}
                                </p>
                            </div>

                            <div className="rounded-xl border border-black/10 bg-black/2.5 p-4">
                                <div className="flex items-center gap-2 text-black/45">
                                    <FlagIcon size={20} weight="bold" />

                                    <span className="text-xs font-semibold uppercase tracking-wide">
                                        Priority
                                    </span>
                                </div>

                                <p className="mt-2 font-semibold text-black">
                                    {getPriorityLabel(task.priority)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                                Description
                            </p>

                            <p className="mt-3 text-sm leading-7 text-black/65">
                                {task.description}
                            </p>
                        </div>
                        {role === "admin" && (
                            <div className="mt-6">
                                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                                    Assigned Staff
                                </p>

                                <Link
                                    to={`/staff-details/${task.assignedTo}`}
                                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/2 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black/20 hover:bg-black hover:text-white"
                                >
                                    <UserCircleIcon size={18} weight="bold" />
                                    <span>{task.assignedStaffName}</span>
                                    <ArrowSquareOutIcon size={15} weight="bold" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lead information */}
                <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
                    <div className="border-b border-black/10 p-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                            Associated lead
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                                <UserCircleIcon size={24} weight="duotone" />
                            </div>

                            <div className="min-w-0">
                                <p className="font-semibold text-black">
                                    {task.leadName}
                                </p>

                                <p className="mt-0.5 truncate text-sm text-black/50">
                                    Lead
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <EnvelopeIcon
                                    size={18}
                                    className="mt-0.5 shrink-0 text-black/40"
                                />

                                <div className="min-w-0">
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-black/35">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm font-medium text-black">
                                        {task.leadEmail}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <CalendarBlankIcon
                                    size={18}
                                    className="mt-0.5 shrink-0 text-black/40"
                                />

                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-black/35">
                                        Created
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-black">
                                        {formatDate(task.createdAt)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <ClockIcon
                                    size={18}
                                    className="mt-0.5 shrink-0 text-black/40"
                                />

                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-black/35">
                                        Last updated
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-black">
                                        {formatDateTime(task.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TaskDetailMainSection;
