import { create } from "zustand";
import type { AdminChatItem } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type AdminAllChatsState = {
    chats: AdminChatItem[];
    loading: boolean;
    error: string | null;

    setChats: (chats: AdminChatItem[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchChats: () => Promise<void>;
};

export const useAdminAllChatsStore = create<AdminAllChatsState>((set) => ({
    chats: [],
    loading: true,
    error: null,

    setChats: (chats) => set({ chats }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchChats: async () => {
        try {
            set({
                loading: true,
                error: null,
            });

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

            set({
                chats: data.data,
            });
        } catch (error) {
            console.error("Failed to fetch admin chats:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching chats",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
