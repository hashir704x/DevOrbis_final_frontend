import { BACKEND_URL } from "@/utils/backend-url";
import { ArrowUpIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "../ui/toast";
import { socket } from "@/socket/socket";
import { useChatStore } from "@/store/user-store/chat-store";

function generateChatTitle(message: string) {
    return message.trim().split(/\s+/).slice(0, 4).join(" ");
}

function SendMessageInput({
    setIsSending,
    isSending,
}: {
    isSending: boolean;
    setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("chatId");
    const [message, setMessage] = useState("");

    const appendMessage = useChatStore((state) => state.appendMessage);

    async function handleSendMessage() {
        const trimmedMessage = message.trim();
        if (!trimmedMessage || isSending) return;
        try {
            setIsSending(true);
            let activeChatId = chatId;
            if (!activeChatId) {
                const title = generateChatTitle(trimmedMessage);
                const response = await fetch(`${BACKEND_URL}/api/chat/create-chat`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title,
                    }),
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Failed to create chat");
                }
                activeChatId = result.data.id;
                socket.emit("chat:message", {
                    chatId: activeChatId,
                    message: trimmedMessage,
                });
                setMessage("");
                navigate(`/user/chat?chatId=${activeChatId}`, { replace: true });
            } else {
                appendMessage({
                    from: "Human",
                    content: trimmedMessage,
                });

                socket.emit("chat:message", {
                    chatId: activeChatId,
                    message: trimmedMessage,
                });
                setMessage("");
            }
        } catch (error) {
            toast.add({
                type: "error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to send message",
            });

            console.error(error);
            setIsSending(false);
        }
    }
    return (
        <div className="shrink-0 px-6 pb-1">
            <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border bg-background p-2 shadow-sm">
                <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder="Ask anything"
                    className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
                />

                <button
                    type="button"
                    disabled={isSending}
                    onClick={handleSendMessage}
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-black text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowUpIcon size={18} weight="bold" />
                </button>
            </div>
        </div>
    );
}

export default SendMessageInput;
