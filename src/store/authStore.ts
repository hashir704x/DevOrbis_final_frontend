import { create } from "zustand";
import type { User } from "@/types";

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;

    setUser: (user: User) => void;
    clearUser: () => void;
    setAuthLoading: (isAuthLoading: boolean) => void;
};
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
