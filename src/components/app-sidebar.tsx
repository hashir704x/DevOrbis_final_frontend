import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  SignOutIcon,
  SparkleIcon,
  HouseIcon,
  DatabaseIcon,
  PenIcon,
  CheckSquareIcon,
  RobotIcon,
} from "@phosphor-icons/react";
import { NavLink } from "react-router";
import type { SideBarNavItem, User } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/components/ui/toast";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { BACKEND_URL } from "@/utils/backend-url";

const navItems: SideBarNavItem[] = [
  {
    title: "Home",
    url: "/admin",
    icon: HouseIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "Knowledge Base",
    url: "/admin/knowledge-base",
    icon: DatabaseIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "All Tasks",
    url: "/admin/all-tasks",
    icon: CheckSquareIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "Create Task",
    url: "/staff-admin/create-task",
    icon: PenIcon,
    allowedRoles: ["admin", "staff"],
  },
  {
    title: "Ai Usage",
    url: "/admin/ai-usage",
    icon: RobotIcon,
    allowedRoles: ["admin"],
  },
  {
    title: "Home",
    url: "/user",
    icon: HouseIcon,
    allowedRoles: ["user"],
  },
  {
    title: "Ai Chat",
    url: "/user/chat",
    icon: DatabaseIcon,
    allowedRoles: ["user"],
  },
];

export function AppSidebar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clearUser = useAuthStore((state) => state.clearUser);

  const user = useAuthStore((state) => state.user) as User;
  const visibleNavItems = navItems.filter((item) =>
    item.allowedRoles.includes(user.role),
  );

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        const result = await response.json();
        toast.add({
          type: "error",
          description: result.message || "Failed to logout",
        });
        return;
      }
      clearUser();
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while logging out",
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-neutral-200 px-4 h-14">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-black text-white">
            <SparkleIcon size={15} weight="fill" />
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-semibold tracking-tight text-black">
              AI Operations
            </span>
            <span className="truncate text-xs text-neutral-500">
              Intelligent workspace
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {visibleNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="p-0">
                    <NavLink
                      to={item.url}
                      end={
                        item.url === "/user" ||
                        item.url === "/admin" ||
                        item.url === "/staff"
                      }
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-black text-white hover:bg-black hover:text-white"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                        }`
                      }
                    >
                      <item.icon size={19} weight="regular" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-neutral-200 p-3 hover:bg-neutral-100 hover:text-black">
        <SidebarMenu>
          <SidebarMenuButton
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-neutral-600 "
          >
            {isLoggingOut ? <Spinner /> : <SignOutIcon size={19} />}
            <span>{isLoggingOut ? "Logging out" : "Logout"}</span>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

// {
//         title: "AI Conversations",
//         url: "/admin/conversations",
//         icon: RobotIcon,
//         allowedRoles: ["admin", "staff"],
//     },
//     {
//         title: "Chat Bot",
//         url: "/chat",
//         icon: ChatCircleIcon,
//         allowedRoles: ["user", "staff", "admin"],
//     },
//     {
//         title: "Leads",
//         url: "/leads",
//         icon: UsersIcon,
//         allowedRoles: ["staff", "admin"],
//     },
//     {
//         title: "Tasks",
//         url: "/tasks",
//         icon: CheckSquareIcon,
//         allowedRoles: ["user", "staff", "admin"],
//     },
//     {
//         title: "Settings",
//         url: "/settings",
//         icon: GearIcon,
//         allowedRoles: ["user", "staff", "admin"],
//     },
