import type { TaskAdmin } from "@/types";
import {
    getStatusLabel,
    getPriorityLabel,
    getStatusIcon,
    formatDate,
} from "@/utils/task-formatters";
import {
    FlagIcon,
    CalendarBlankIcon,
    ArrowSquareOutIcon,
    PencilSimpleIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router";

function AdminTaskCard({ task }: { task: TaskAdmin }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md">
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
                                <CalendarBlankIcon size={16} weight="bold" />
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
                            <ArrowSquareOutIcon size={17} weight="bold" />
                            Open
                        </Link>
                        <Link
                            to={`/staff-admin/edit-task/${task.id}`}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white transition-colors hover:bg-black/80"
                        >
                            <PencilSimpleIcon size={17} weight="bold" />
                            Edit
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminTaskCard;
