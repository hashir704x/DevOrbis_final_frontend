import { create } from "zustand";
import type { Message } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type ChatState = {
    messages: Message[];
    isLoadingMessages: boolean;
    messagesError: string | null;

    setMessages: (messages: Message[]) => void;
    setIsLoadingMessages: (isLoading: boolean) => void;
    setMessagesError: (error: string | null) => void;

    fetchMessages: (chatId: string) => Promise<void>;
    appendChatChunk: (chunk: string) => void;
    appendMessage: (message: Message) => void;
};

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isLoadingMessages: false,
    messagesError: null,

    setMessages: (messages) => set({ messages }),
    setIsLoadingMessages: (isLoading) => set({ isLoadingMessages: isLoading }),
    setMessagesError: (error) => set({ messagesError: error }),
    fetchMessages: async (chatId) => {
        set({
            messages: [],
            messagesError: null,
            isLoadingMessages: false,
        });
        if (!chatId) {
            return;
        }
        try {
            set({ isLoadingMessages: true });
            const response = await fetch(`${BACKEND_URL}/api/chat/${chatId}`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to fetch chat");
            }
            set({
                messages: result.data,
            });
        } catch (error) {
            console.log(error);
            set({
                messagesError:
                    error instanceof Error ? error.message : "Failed to load chat",
            });
        } finally {
            set({
                isLoadingMessages: false,
            });
        }
    },
    appendChatChunk: (chunk) =>
        set((state) => {
            if (state.messages.length === 0) {
                return {
                    messages: [
                        {
                            from: "Ai",
                            content: chunk,
                        },
                    ],
                };
            }
            const lastMessage = state.messages[state.messages.length - 1];
            if (lastMessage.from === "Ai") {
                return {
                    messages: [
                        ...state.messages.slice(0, -1),
                        {
                            ...lastMessage,
                            content: lastMessage.content + chunk,
                        },
                    ],
                };
            }
            return {
                messages: [
                    ...state.messages,
                    {
                        from: "Ai",
                        content: chunk,
                    },
                ],
            };
        }),
    appendMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),
}));
