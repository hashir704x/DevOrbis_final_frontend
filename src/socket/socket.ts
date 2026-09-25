import { BACKEND_URL } from "@/utils/backend-url";
import { io } from "socket.io-client";

export const socket = io(`${BACKEND_URL}`, {
    withCredentials: true,
    autoConnect: false,
});
