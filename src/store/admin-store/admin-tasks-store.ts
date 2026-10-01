import { create } from "zustand";
import type { TaskAdmin } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type AdminTasksState = {
    tasks: TaskAdmin[];
    loading: boolean;
    error: string | null;

    setTasks: (tasks: TaskAdmin[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchTasks: () => Promise<void>;
};

export const useAdminTasksStore = create<AdminTasksState>((set) => ({
    tasks: [],
    loading: true,
    error: null,

    setTasks: (tasks) => set({ tasks }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchTasks: async () => {
        try {
            set({
                loading: true,
                error: null,
            });

            const response = await fetch(
                `${BACKEND_URL}/api/tasks/get-admin-tasks`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch tasks");
            }

            set({
                tasks: data.data,
            });
        } catch (error) {
            console.error("Failed to fetch admin tasks:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching tasks.",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
