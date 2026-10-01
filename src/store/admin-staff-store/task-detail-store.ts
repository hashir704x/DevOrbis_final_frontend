import { create } from "zustand";
import type { TaskDetail } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type TaskDetailState = {
    task: TaskDetail | null;
    loading: boolean;
    error: string;

    setTask: (task: TaskDetail | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;

    fetchTask: (taskId: string) => Promise<void>;
};

export const useTaskDetailStore = create<TaskDetailState>((set) => ({
    task: null,
    loading: true,
    error: "",

    setTask: (task) => set({ task }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    fetchTask: async (taskId) => {
        try {
            set({
                loading: true,
                error: "",
            });
            const response = await fetch(
                `${BACKEND_URL}/api/tasks/get-task-detail/${taskId}`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch task details.");
            }
            set({
                task: data.data,
            });
        } catch (error) {
            console.error("Failed to fetch task details:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching the task.",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
