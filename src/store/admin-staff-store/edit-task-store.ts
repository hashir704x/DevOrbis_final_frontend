import { create } from "zustand";
import type { Staff, TaskDetail } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

type EditTaskState = {
    task: TaskDetail | null;
    staff: Staff[];
    loading: boolean;
    error: string;

    setTask: (task: TaskDetail | null) => void;
    setStaff: (staff: Staff[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;

    fetchTaskData: (taskId: string, role: string) => Promise<void>;
};

export const useEditTaskStore = create<EditTaskState>((set) => ({
    task: null,
    staff: [],
    loading: true,
    error: "",

    setTask: (task) => set({ task }),
    setStaff: (staff) => set({ staff }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    fetchTaskData: async (taskId, role) => {
        try {
            set({
                loading: true,
                error: "",
            });

            const taskResponse = await fetch(
                `${BACKEND_URL}/api/tasks/get-task-detail/${taskId}`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            const taskData = await taskResponse.json();
            if (!taskResponse.ok) {
                throw new Error(taskData.message || "Failed to fetch task details.");
            }

            set({
                task: taskData.data,
            });

            if (role === "admin") {
                const staffResponse = await fetch(
                    `${BACKEND_URL}/api/staff/get-all-staff`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );

                const staffData = await staffResponse.json();
                if (!staffResponse.ok) {
                    throw new Error(
                        staffData.message || "Failed to fetch staff members.",
                    );
                }

                set({
                    staff: staffData.data,
                });
            }
        } catch (error) {
            console.error("Failed to fetch edit task data:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while getting the task details.",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
