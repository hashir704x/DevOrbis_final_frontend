import ProtectedLayout from "./layouts/protected-layout";
import { createBrowserRouter, RouterProvider } from "react-router";
import AuthProvider from "./providers/auth-provider";
import UserHome from "./pages/user-home";
import Login from "./pages/login";
import SignUp from "./pages/sign-up";
import VerifyEmail from "./pages/verify-email";
import PublicLayout from "./layouts/public-layout";
import AdminHome from "./pages/admin-home";
import StaffHome from "./pages/staff-home";
import StaffTasks from "./pages/staff-tasks";
import RoleProtectedLayout from "./layouts/role-protected-layout";
import Landing from "./pages/landing";
import KnowledgeBase from "./pages/knowledge-base";
import Chat from "./pages/chat";
import CreateTask from "./pages/create-task";
import AdminTasks from "./pages/admin-tasks";
import TaskDetail from "./pages/task-detail";
import EditTask from "./pages/edit-task";
import AiUsage from "./pages/ai-usage";
import VoiceChat from "./pages/voice-chat";
import AdminAllChats from "./pages/admin-all-chats";
import AdminChatData from "./pages/admin-chat-data";

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
                                Component: AdminChatData
                            }
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
