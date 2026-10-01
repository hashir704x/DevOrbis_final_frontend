import { create } from "zustand";
import type { Lead, Staff } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type CreateTaskState = {
    leads: Lead[];
    staff: Staff[];
    loading: boolean;
    error: string | null;

    setLeads: (leads: Lead[]) => void;
    setStaff: (staff: Staff[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchTaskData: (role: string) => Promise<void>;
};

export const useCreateTaskStore = create<CreateTaskState>((set) => ({
    leads: [],
    staff: [],
    loading: true,
    error: null,

    setLeads: (leads) => set({ leads }),
    setStaff: (staff) => set({ staff }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchTaskData: async (role) => {
        try {
            set({
                loading: true,
                error: null,
            });
            const leadsResponse = await fetch(
                `${BACKEND_URL}/api/lead/get-all-leads`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );
            if (!leadsResponse.ok) {
                throw new Error("Failed to fetch leads");
            }
            const leadsData = await leadsResponse.json();
            set({
                leads: leadsData.data,
            });
            if (role === "admin") {
                const staffResponse = await fetch(
                    `${BACKEND_URL}/api/staff/get-all-staff`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                if (!staffResponse.ok) {
                    throw new Error("Failed to fetch staff members");
                }
                const staffData = await staffResponse.json();
                set({
                    staff: staffData.data,
                });
            }
        } catch (error) {
            console.error("Failed to fetch create task data:", error);
            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while fetching data",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
