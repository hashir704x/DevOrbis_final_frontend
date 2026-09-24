import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router";

function PublicLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default PublicLayout;
