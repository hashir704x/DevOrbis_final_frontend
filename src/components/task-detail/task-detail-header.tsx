import { ClipboardTextIcon, PencilSimpleIcon } from "@phosphor-icons/react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import type { TaskDetail } from "@/types";

function TaskDetailHeader({ task }: { task: TaskDetail }) {
    return (
        <div className="overflow-hidden rounded-3xl border-2">
            <div className="flex flex-col gap-6 p-7 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em]">
                        <ClipboardTextIcon size={14} weight="bold" />
                        Task details
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        {task.title}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6">
                        Detailed information about this task and its associated lead.
                    </p>
                </div>

                <Link to={`/staff-admin/edit-task/${task.id}`}>
                    <Button className="w-full rounded-lg cursor-pointer h-10">
                        <PencilSimpleIcon size={17} weight="bold" />
                        Edit task
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default TaskDetailHeader;
