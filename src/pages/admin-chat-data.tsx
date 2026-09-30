import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { BACKEND_URL } from "@/utils/backend-url";
import type { Message } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeftIcon } from "@phosphor-icons/react";

function AdminChatData() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(
                    `${BACKEND_URL}/api/chat/get-chat-messages-for-admin/${chatId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch chat messages");
                }

                setMessages(data.data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching messages",
                );
            } finally {
                setLoading(false);
            }
        })();
    }, [chatId]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner className="size-7" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full flex-col items-center justify-center px-6">
                <div className="w-full max-w-md rounded-lg border border-black bg-white p-6 text-center">
                    <h2 className="text-lg font-semibold text-black">
                        Failed to load conversation
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-white p-6">
            {/* Header */}
            <div className="mb-5 flex items-center gap-4">
                <Link
                    to="/admin/all-chats"
                    className="flex size-9 items-center justify-center rounded-md border border-gray-300 text-black transition hover:bg-gray-100"
                >
                    <ArrowLeftIcon size={18} />
                </Link>

                <div>
                    <h1 className="text-2xl font-semibold text-black">
                        Conversation
                    </h1>

                    <p className="text-sm text-gray-500">Chat ID: {chatId}</p>
                </div>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-hidden rounded-lg border border-black">
                {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-gray-500">
                            No messages found in this conversation.
                        </p>
                    </div>
                ) : (
                    <div className="h-full space-y-6 overflow-y-auto p-6">
                        {messages.map((message, index) => {
                            const isHuman = message.from === "Human";

                            return (
                                <div
                                    key={index}
                                    className={`flex ${
                                        isHuman ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div className="max-w-[75%]">
                                        <div
                                            className={`mb-1 text-xs font-medium ${
                                                isHuman
                                                    ? "text-right text-gray-500"
                                                    : "text-left text-gray-500"
                                            }`}
                                        >
                                            {isHuman ? "User" : "AI"}
                                        </div>

                                        <div
                                            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                                isHuman
                                                    ? "rounded-br-sm bg-black text-white"
                                                    : "rounded-bl-sm border border-gray-200 bg-gray-100 text-black"
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap wrap-break-word">
                                                {message.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminChatData;
