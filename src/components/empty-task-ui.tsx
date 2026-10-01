import { ClipboardTextIcon } from "@phosphor-icons/react";

function EmptyTaskUi() {
    return (
        <div className="flex min-h-75 items-center justify-center">
            <div className="max-w-md text-center">
                <div className="mb-4 flex justify-center mt-44">
                    <ClipboardTextIcon
                        size={42}
                        weight="regular"
                        className="text-neutral-400"
                    />
                </div>
                <h2 className="text-xl font-semibold text-black">No tasks yet</h2>
            </div>
        </div>
    );
}

export default EmptyTaskUi;
