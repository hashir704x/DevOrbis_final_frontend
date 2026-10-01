import type { AdminChatItem } from "@/types";
import { Link } from "react-router";

function AdminChatCard({
    chat,
    index,
    chatsLength,
}: {
    chat: AdminChatItem;
    index: number;
    chatsLength: number;
}) {
    return (
        <div>
            <div
                className={`flex items-center justify-between px-5 py-4 ${
                    index !== chatsLength - 1 ? "border-b border-gray-200" : ""
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
        </div>
    );
}

export default AdminChatCard;
