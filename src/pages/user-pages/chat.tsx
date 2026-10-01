import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { socket } from "@/socket/socket";
import ChatPageHeader from "@/components/chat/chat-page-header";
import LoadingUi from "@/components/loading-ui";
import ErrorUi from "@/components/error-ui";
import MessageItem from "@/components/chat/message-item";
import SendMessageInput from "@/components/chat/send-message-input";
import EmptyMessagesUi from "@/components/chat/empty-messages-ui";
import { useChatStore } from "@/store/user-store/chat-store";

function Chat() {
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("chatId");

    const messages = useChatStore((state) => state.messages);
    const isLoadingMessages = useChatStore((state) => state.isLoadingMessages);
    const messagesError = useChatStore((state) => state.messagesError);
    const fetchMessages = useChatStore((state) => state.fetchMessages);
    const appendChatChunk = useChatStore((state) => state.appendChatChunk);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (!chatId) {
            return;
        }
        fetchMessages(chatId);
    }, [chatId, fetchMessages]);

    useEffect(() => {
        function handleChatChunk(chunk: string) {
            appendChatChunk(chunk);
        }

        function handleChatComplete() {
            console.log("FRONTEND STREAM COMPLETE");
            setIsSending(false);
        }

        socket.connect();

        socket.on("chat:chunk", handleChatChunk);
        socket.on("chat:complete", handleChatComplete);

        return () => {
            socket.off("chat:chunk", handleChatChunk);
            socket.off("chat:complete", handleChatComplete);
            socket.disconnect();
        };
    }, [appendChatChunk]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    return (
        <div className="flex min-h-0 flex-1 flex-col h-full">
            <ChatPageHeader />

            <div className="flex min-h-0 flex-1 flex-col px-6">
                {isLoadingMessages ? (
                    <LoadingUi />
                ) : messagesError ? (
                    <ErrorUi errorMessage={messagesError} />
                ) : messages.length === 0 ? (
                    <EmptyMessagesUi />
                ) : (
                    <div className="flex-1 overflow-y-auto py-6">
                        <div className="mx-auto flex max-w-3xl flex-col gap-6">
                            {messages.map((message, index) => (
                                <MessageItem message={message} key={index} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                )}
            </div>

            <SendMessageInput
                isSending={isSending}
                setIsSending={setIsSending}
            />
        </div>
    );
}

export default Chat;
