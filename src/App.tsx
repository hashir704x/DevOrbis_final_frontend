import ProtectedLayout from "./layouts/protected-layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthProvider from "./providers/auth-provider";
import Login from "./pages/login";
import SignUp from "./pages/sign-up";
import VerifyEmail from "./pages/verify-email";
import PublicLayout from "./layouts/public-layout";
import RoleProtectedLayout from "./layouts/role-protected-layout";
import Landing from "./pages/landing";

// user pages
import UserHome from "./pages/user-pages/user-home";
import Chat from "./pages/user-pages/chat";
import VoiceChat from "./pages/user-pages/voice-chat";

// staff pages
import StaffHome from "./pages/staff-pages/staff-home";
import StaffTasks from "./pages/staff-pages/staff-tasks";

// admin pages
import AdminHome from "./pages/admin-pages/admin-home";
import AdminTasks from "./pages/admin-pages/admin-tasks";
import KnowledgeBase from "./pages/admin-pages/knowledge-base";
import AdminAllChats from "./pages/admin-pages/admin-all-chats";
import AdminChatData from "./pages/admin-pages/admin-chat-data";
import AiUsage from "./pages/admin-pages/ai-usage";

// admin staff shared pages
import CreateTask from "./pages/admin-staff-pages/create-task";
import EditTask from "./pages/admin-staff-pages/edit-task";
import TaskDetail from "./pages/admin-staff-pages/task-detail";

const router = createBrowserRouter([
    {
        Component: AuthProvider,
        children: [
            {
                path: "/",
                Component: Landing,
            },
            {
                Component: ProtectedLayout,
                children: [
                    {
                        path: "user",
                        Component: RoleProtectedLayout,
                        handle: {
                            allowedRoles: ["user"],
                        },
                        children: [
                            {
                                path: "",
                                Component: UserHome,
                            },
                            {
                                path: "chat",
                                Component: Chat,
                            },
                            {
                                path: "voice-chat",
                                Component: VoiceChat,
                            },
                        ],
                    },
                    {
                        path: "staff",
                        Component: RoleProtectedLayout,
                        handle: {
                            allowedRoles: ["staff"],
                        },
                        children: [
                            {
                                path: "",
                                Component: StaffHome,
                            },
                            {
                                path: "staff-tasks",
                                Component: StaffTasks,
                            },
                        ],
                    },
                    {
                        path: "admin",
                        Component: RoleProtectedLayout,
                        handle: {
                            allowedRoles: ["admin"],
                        },
                        children: [
                            {
                                path: "",
                                Component: AdminHome,
                            },
                            {
                                path: "knowledge-base",
                                Component: KnowledgeBase,
                            },
                            {
                                path: "all-tasks",
                                Component: AdminTasks,
                            },
                            {
                                path: "ai-usage",
                                Component: AiUsage,
                            },
                            {
                                path: "all-chats",
                                Component: AdminAllChats,
                            },
                            {
                                path: "chat-detail/:chatId",
                                Component: AdminChatData,
                            },
                        ],
                    },
                    {
                        path: "staff-admin",
                        Component: RoleProtectedLayout,
                        handle: {
                            allowedRoles: ["staff", "admin"],
                        },
                        children: [
                            {
                                path: "create-task",
                                Component: CreateTask,
                            },
                            {
                                path: "task-detail/:taskId",
                                Component: TaskDetail,
                            },
                            {
                                path: "edit-task/:taskId",
                                Component: EditTask,
                            },
                        ],
                    },
                ],
            },
            {
                Component: PublicLayout,
                children: [
                    {
                        path: "login",
                        Component: Login,
                    },
                    {
                        path: "sign-up",
                        Component: SignUp,
                    },
                    {
                        path: "verify-email",
                        Component: VerifyEmail,
                    },
                ],
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
