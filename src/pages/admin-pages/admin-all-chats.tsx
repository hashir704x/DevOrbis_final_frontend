import { useEffect } from "react";
import AdminChatCard from "@/components/admin-all-chats/admin-chat-card";
import { useAdminAllChatsStore } from "@/store/admin-store/admin-all-chats-store";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";

function AdminAllChats() {
    const chats = useAdminAllChatsStore((state) => state.chats);
    const loading = useAdminAllChatsStore((state) => state.loading);
    const error = useAdminAllChatsStore((state) => state.error);
    const fetchChats = useAdminAllChatsStore((state) => state.fetchChats);

    useEffect(() => {
        fetchChats();
    }, [fetchChats]);

    if (loading) {
        return <LoadingUi />;
    }
    if (error) {
        return (
            <ErrorUi errorMessage={error} errorDescription="Failed to get chats" />
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
                        <AdminChatCard
                            chat={chat}
                            chatsLength={chats.length}
                            key={chat.id}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminAllChats;
