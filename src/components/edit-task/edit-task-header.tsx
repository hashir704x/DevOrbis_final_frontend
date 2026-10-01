import { ClipboardTextIcon } from "@phosphor-icons/react";

function EditTaskHeader() {
    return (
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
                    Update the task information, progress, priority, and assignment.
                </p>
            </div>
        </div>
    );
}

export default EditTaskHeader;
