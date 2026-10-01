import { SparkleIcon } from "@phosphor-icons/react";

function EmptyMessagesUi() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="flex max-w-xl flex-col items-center text-center">
                <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-black text-white">
                    <SparkleIcon size={22} weight="fill" />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight">
                    How can I help you today?
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Ask questions about our services, get information from the
                    knowledge base, or get help with your operations.
                </p>
            </div>
        </div>
    );
}

export default EmptyMessagesUi;
