import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { WarningCircleIcon } from "@phosphor-icons/react";
import { Toaster } from "@/components/ui/toast";

function AuthProvider() {
    const setUser = useAuthStore((state) => state.setUser);
    const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
    const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
    const [error, setError] = useState(false);

    useEffect(function () {
        (async function () {
            try {
                const response = await fetch(
                    "http://localhost:3000/api/auth/get-current-user",
                    {
                        credentials: "include",
                        method: "POST",
                    },
                );
                if (!response.ok) return;
                const result = await response.json();
                setUser(result.data);
            } catch (error) {
                setError(true);
            } finally {
                setAuthLoading(false);
            }
        })();
    }, []);

    if (isAuthLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner className="size-10" />
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="flex max-w-md flex-col items-center text-center">
                    <WarningCircleIcon size={40} weight="regular" />

                    <h1 className="text-xl font-semibold">Unable to connect</h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Something went wrong. Please check your connection and try
                        again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Outlet />
            <Toaster />
        </>
    );
}

export default AuthProvider;
