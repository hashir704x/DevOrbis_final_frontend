import { create } from "zustand";
import type { TaskStaff } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type StaffTasksState = {
    tasks: TaskStaff[];
    loading: boolean;
    error: string | null;

    setTasks: (tasks: TaskStaff[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchTasks: () => Promise<void>;
};

export const useStaffTasksStore = create<StaffTasksState>((set) => ({
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
                `${BACKEND_URL}/api/tasks/get-staff-tasks`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to fetch tasks");
            }

            set({
                tasks: result.data,
            });
        } catch (error) {
            console.error("Failed to fetch staff tasks:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading your tasks.",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
