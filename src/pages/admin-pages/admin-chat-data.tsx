import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import { useAdminChatDataStore } from "@/store/admin-store/admin-chat-data-store";

function AdminChatData() {
    const { chatId } = useParams();
    const messages = useAdminChatDataStore((state) => state.messages);
    const loading = useAdminChatDataStore((state) => state.loading);
    const error = useAdminChatDataStore((state) => state.error);
    const fetchMessages = useAdminChatDataStore((state) => state.fetchMessages);

    useEffect(() => {
        if (!chatId) {
            return;
        }

        fetchMessages(chatId);
    }, [chatId, fetchMessages]);


    if (loading) {
        return <LoadingUi />;
    }
    if (error) {
        return (
            <ErrorUi
                errorMessage={error}
                errorDescription="Failed to get chats data"
            />
        );
    }
    return (
        <div className="flex h-full flex-col bg-white p-6">
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
