import { create } from "zustand";
import type { UserTask } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

type UserHomeState = {
    tasks: UserTask[];
    isLead: boolean | null;
    loading: boolean;
    error: string | null;

    setTasks: (tasks: UserTask[]) => void;
    setIsLead: (isLead: boolean | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchTasks: () => Promise<void>;
};

export const useUserHomeStore = create<UserHomeState>((set) => ({
    tasks: [],
    isLead: null,
    loading: true,
    error: null,

    setTasks: (tasks) => set({ tasks }),
    setIsLead: (isLead) => set({ isLead }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchTasks: async () => {
        try {
            set({ loading: true, error: null });
            const response = await fetch(`${BACKEND_URL}/api/tasks/get-user-tasks`, {
                method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to fetch tasks");
            }
            set({
                isLead: result.data.isLead,
                tasks: result.data.tasks,
            });
        } catch (error) {
            console.error("Failed to fetch user tasks:", error);
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching tasks.",
            });
        } finally {
            set({ loading: false });
        }
    },
}));
