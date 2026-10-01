import type { Message } from "@/types";
import { RobotIcon, UserIcon } from "@phosphor-icons/react";

function MessageItem({ message }: { message: Message }) {
    const isHuman = message.from === "Human";
    return (
        <div className={`flex gap-3 ${isHuman ? "justify-end" : "justify-start"}`}>
            {!isHuman && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-white">
                    <RobotIcon size={17} weight="fill" />
                </div>
            )}

            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isHuman
                        ? "rounded-br-md bg-black text-white"
                        : "rounded-bl-md border bg-muted/40 text-foreground"
                }`}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
            </div>

            {isHuman && (
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                    <UserIcon size={17} weight="fill" />
                </div>
            )}
        </div>
    );
}

export default MessageItem;
