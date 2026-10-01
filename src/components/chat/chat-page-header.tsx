import { PlusIcon } from "@phosphor-icons/react";
import PreviousChats from "./previous-chats";
import { useNavigate } from "react-router";

function ChatPageHeader() {
    const navigate = useNavigate();
    return (
        <div className="flex shrink-0 items-center justify-between px-6">
            <div>
                <h1 className="text-lg font-semibold">AI Assistant</h1>
                <p className="text-sm text-muted-foreground">
                    Your intelligent operations assistant
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => navigate("/user/chat", { replace: true })}
                    className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
                >
                    <PlusIcon size={16} weight="bold" />
                    New Chat
                </button>

                <PreviousChats />
            </div>
        </div>
    );
}

export default ChatPageHeader;
