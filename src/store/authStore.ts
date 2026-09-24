import { create } from "zustand";
import type { AuthState } from "@/types";

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isAuthLoading: true,
    setUser: (user) =>
        set({
            user,
            isAuthenticated: true,
        }),
    clearUser: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),

    setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
}));
