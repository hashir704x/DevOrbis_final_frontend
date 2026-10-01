import { create } from "zustand";
import type { Message } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type AdminChatDataState = {
    messages: Message[];
    loading: boolean;
    error: string | null;

    setMessages: (messages: Message[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchMessages: (chatId: string) => Promise<void>;
};

export const useAdminChatDataStore = create<AdminChatDataState>((set) => ({
    messages: [],
    loading: true,
    error: null,

    setMessages: (messages) => set({ messages }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchMessages: async (chatId) => {
        try {
            set({
                loading: true,
                error: null,
            });

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

            set({
                messages: data.data,
            });
        } catch (error) {
            console.error("Failed to fetch admin chat messages:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching messages",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
