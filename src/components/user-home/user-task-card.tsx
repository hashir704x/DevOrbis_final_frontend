import type { UserTask } from "@/types";
import { formatDate, getStatusLabel } from "@/utils/task-formatters";
import { FlagIcon, CalendarBlankIcon, ClockIcon } from "@phosphor-icons/react";

function UserTaskCard({task}: { task: UserTask }) {
    return (
        <div
            key={task.id}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
        >
            <div className="flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-black">
                            {task.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                            {task.description}
                        </p>
                    </div>

                    <span
                        className={`w-fit shrink-0 rounded-full border-2 px-3 py-1 text-xs font-medium`}
                    >
                        {getStatusLabel(task.status)}
                    </span>
                </div>

                {/* Task metadata */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-100 pt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <FlagIcon size={17} weight="regular" />

                        <span className="text-neutral-500">Priority:</span>

                        <span className={`font-medium`}>
                            {task.priority.toUpperCase()}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-500">
                        <CalendarBlankIcon size={17} weight="regular" />

                        <span>Created {formatDate(task.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-500">
                        <ClockIcon size={17} weight="regular" />

                        <span>Updated {formatDate(task.updatedAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserTaskCard;
