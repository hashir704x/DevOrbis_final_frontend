import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

function ProtectedLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return (
        <TooltipProvider>
            <SidebarProvider className="h-svh">
                <AppSidebar />

                <main className="flex min-w-0 flex-1 flex-col">
                    <div className="flex h-14 shrink-0 items-center border-b px-4">
                        <SidebarTrigger />
                    </div>

                    <div className="min-h-0 flex-1 p-4">
                        <Outlet />
                    </div>
                </main>
            </SidebarProvider>
        </TooltipProvider>
    );
}

export default ProtectedLayout;
