import { startVoiceCall } from "@/vapi/vapi";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { vapiClient } from "@/vapi/vapi";
import type { User, VoiceMessage } from "@/types";
import { useAuthStore } from "@/store/authStore";

function VoiceChat() {
    const user = useAuthStore((state) => state.user) as User;
    const [isCallActive, setIsCallActive] = useState(false);
    const [messages, setMessages] = useState<VoiceMessage[]>([]);

    useEffect(() => {
        const handleCallStart = () => {
            console.log("Starting");
            setMessages([]);
            setIsCallActive(true);
        };

        const handleCallEnd = () => {
            console.log("ending");
            setIsCallActive(false);
        };

        const handleError = (error: unknown) => {
            console.error("Vapi error:", error);
            setIsCallActive(false);
        };

        const handleMessage = (message: any) => {
            if (
                message.type === "transcript" &&
                message.transcriptType === "final"
            ) {
                if (message.role === "user") {
                    setMessages((prev) => [
                        ...prev,
                        {
                            role: "user",
                            content: message.transcript,
                        },
                    ]);
                }
                if (message.role === "assistant") {
                    setMessages((prev) => {
                        const lastMessage = prev[prev.length - 1];
                        if (lastMessage?.role === "assistant") {
                            return [
                                ...prev.slice(0, -1),
                                {
                                    ...lastMessage,
                                    content: `${lastMessage.content} ${message.transcript}`,
                                },
                            ];
                        }

                        return [
                            ...prev,
                            {
                                role: "assistant",
                                content: message.transcript,
                            },
                        ];
                    });
                }
            }
        };

        vapiClient.on("call-start", handleCallStart);
        vapiClient.on("call-end", handleCallEnd);
        vapiClient.on("error", handleError);
        vapiClient.on("message", handleMessage);

        return () => {
            vapiClient.off("call-start", handleCallStart);
            vapiClient.off("call-end", handleCallEnd);
            vapiClient.off("error", handleError);
            vapiClient.off("message", handleMessage);
        };
    }, []);

    async function handleVoiceCall() {
        try {
            await startVoiceCall(user.id);
        } catch (error) {
            console.error("Failed to start Vapi call:", error);
        }
    }
    function handleStopCall() {
        vapiClient.stop();
    }

    return (
        <div>
            <h1 className="text-3xl">Voice chat</h1>
            <div>
                {!isCallActive ? (
                    <Button onClick={handleVoiceCall}>Start Voice</Button>
                ) : (
                    <Button onClick={handleStopCall}>Stop Voice</Button>
                )}
            </div>
            <div className="mt-6 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={
                            message.role === "user" ? "text-right" : "text-left"
                        }
                    >
                        <div
                            className={
                                message.role === "user"
                                    ? "inline-block rounded-lg bg-black px-4 py-2 text-white"
                                    : "inline-block rounded-lg bg-gray-100 px-4 py-2 text-black"
                            }
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VoiceChat;
