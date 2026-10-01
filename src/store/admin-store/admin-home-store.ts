import { create } from "zustand";
import type { AdminDashboardStats } from "@/types";
import { BACKEND_URL } from "@/utils/backend-url";

export type AdminHomeState = {
    stats: AdminDashboardStats | null;
    loading: boolean;
    error: string | null;

    setStats: (stats: AdminDashboardStats | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    fetchStats: () => Promise<void>;
};

export const useAdminHomeStore = create<AdminHomeState>((set) => ({
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
                `${BACKEND_URL}/api/admin/get-dashboard-stats`,
                {
                    method: "GET",
                    credentials: "include",
                },
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to fetch dashboard stats");
            }

            set({
                stats: result.data,
            });
        } catch (error) {
            console.error("Dashboard stats error:", error);

            set({
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading the dashboard",
            });
        } finally {
            set({
                loading: false,
            });
        }
    },
}));
