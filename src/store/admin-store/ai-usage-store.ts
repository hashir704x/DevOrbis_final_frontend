import { create } from "zustand";
import type { AiUsageStats } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type AiUsageState = {
    stats: AiUsageStats | null;
    loading: boolean;
    error: string | null;

    setStats: (stats: AiUsageStats | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchStats: () => Promise<void>;
};

export const useAiUsageStore = create<AiUsageState>((set) => ({
    stats: null,
    loading: true,
    error: null,

    setStats: (stats) => set({ stats }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchStats: async () => {
        try {
            set({
                loading: true,
                error: null,
            });

            const response = await fetch(
                `${BACKEND_URL}/api/ai-usage/get-ai-usage`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            const data = await response.json();
            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch AI usage statistics.",
                );
            }

            set({
                stats: data.data,
            });
        } catch (error) {
            console.error("Failed to fetch AI usage statistics:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching AI usage statistics.",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
