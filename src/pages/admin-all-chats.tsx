import type { AdminChatItem } from "@/types";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/utils/backend-url";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "react-router";

function AdminAllChats() {
    const [chats, setChats] = useState<AdminChatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async function () {
            try {
                setLoading(true);
                setError("");
                const response = await fetch(
                    `${BACKEND_URL}/api/chat/get-chats-for-admin`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch chats");
                }
                setChats(data.data);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching chats",
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="rounded-lg border border-black bg-white px-6 py-4 text-center">
                    <p className="font-medium text-black">Failed to load chats</p>
                    <p className="mt-1 text-sm text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-black">
                    AI Conversations
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                    View conversations between users and the AI chatbot.
                </p>
            </div>

            {chats.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300">
                    <p className="text-sm text-gray-500">No conversations found.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-black bg-white">
                    {chats.map((chat, index) => (
                        <div
                            key={chat.id}
                            className={`flex items-center justify-between px-5 py-4 ${
                                index !== chats.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                            }`}
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium text-black">
                                    {chat.title || "Untitled conversation"}
                                </p>

                                <p className="mt-1 truncate text-sm text-gray-500">
                                    {chat.userName || "Unknown user"}
                                    {chat.userEmail && ` • ${chat.userEmail}`}
                                </p>
                            </div>

                            <div className="ml-4 flex shrink-0 items-center gap-4">
                                <span className="text-xs text-gray-500">
                                    {new Date(chat.updatedAt).toLocaleString()}
                                </span>

                                <Link
                                    to={`/admin/chat-detail/${chat.id}`}
                                    className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                                >
                                    Open Chat
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminAllChats;
