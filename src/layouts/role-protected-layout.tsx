import { useAuthStore } from "@/store/authStore";
import { Navigate, Outlet, useMatches } from "react-router";
import type { role, User } from "@/types";

function RoleProtectedLayout() {
    const user = useAuthStore((state) => state.user) as User;
    const matches = useMatches();
    const protectedMatch = matches.find((match) => {
        const handle = match.handle as { allowedRoles?: role[] } | undefined;
        return handle?.allowedRoles;
    });
    const allowedRoles = (
        protectedMatch?.handle as { allowedRoles?: role[] } | undefined
    )?.allowedRoles;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}

export default RoleProtectedLayout;
