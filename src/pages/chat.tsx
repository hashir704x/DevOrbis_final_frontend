import {
  SparkleIcon,
  ArrowUpIcon,
  RobotIcon,
  UserIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import PreviousChats from "@/components/chat/previous-chats";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "@/components/ui/toast";
import { useSearchParams } from "react-router";
import type { Message } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { socket } from "@/socket/socket";
import { BACKEND_URL } from "@/utils/backend-url";

function generateChatTitle(message: string) {
  return message.trim().split(/\s+/).slice(0, 4).join(" ");
}

function Chat() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("chatId");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function handleSendMessage() {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    try {
      let activeChatId = chatId;
      if (!activeChatId) {
        const title = generateChatTitle(trimmedMessage);
        const response = await fetch(`${BACKEND_URL}/api/chat/create-chat`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
          }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to create chat");
        }
        activeChatId = result.data.id;
        socket.emit("chat:message", {
          chatId: activeChatId,
          message: trimmedMessage,
        });
        setMessage("");
        navigate(`/user/chat?chatId=${activeChatId}`, { replace: true });
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "Human",
            content: trimmedMessage,
          },
        ]);
        socket.emit("chat:message", {
          chatId: activeChatId,
          message: trimmedMessage,
        });
        setMessage("");
      }
    } catch (error) {
      toast.add({
        type: "error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
      });
      console.error(error);
    }
  }

  useEffect(() => {
    setMessages([]);
    setMessagesError(null);
    setIsLoadingMessages(false);
    (async function () {
      if (!chatId) {
        return;
      }
      try {
        setIsLoadingMessages(true);
        const response = await fetch(`${BACKEND_URL}/api/chat/${chatId}`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch chat");
        }
        setMessages(result.data);
      } catch (error) {
        console.log(error);
        setMessagesError(
          error instanceof Error ? error.message : "Failed to load chat",
        );
      } finally {
        setIsLoadingMessages(false);
      }
    })();
  }, [chatId]);

  useEffect(() => {
    function handleChatChunk(chunk: string) {
      console.log("FRONTEND CHUNK:", chunk);
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage.from === "Ai") {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              content: lastMessage.content + chunk,
            },
          ];
        }
        return [
          ...prev,
          {
            from: "Ai",
            content: chunk,
          },
        ];
      });
    }

    function handleChatComplete() {
      console.log("FRONTEND STREAM COMPLETE");
    }
    socket.connect();
    socket.on("chat:chunk", handleChatChunk);
    socket.on("chat:complete", handleChatComplete);
    return () => {
      socket.off("chat:chunk", handleChatChunk);
      socket.off("chat:complete", handleChatComplete);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex min-h-0 flex-1 flex-col h-full">
      <div className="flex shrink-0 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold">AI Assistant</h1>
          <p className="text-sm text-muted-foreground">
            Your intelligent operations assistant
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/user/chat", { replace: true })}
            className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
          >
            <PlusIcon size={16} weight="bold" />
            New Chat
          </button>

          <PreviousChats />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-6">
        {isLoadingMessages ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner />
          </div>
        ) : messagesError ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium">Failed to load conversation</p>

              <p className="mt-1 text-sm text-destructive">{messagesError}</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex max-w-xl flex-col items-center text-center">
              <div className="mb-5 flex size-12 items-center justify-center rounded-full bg-black text-white">
                <SparkleIcon size={22} weight="fill" />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight">
                How can I help you today?
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Ask questions about our services, get information from the knowledge
                base, or get help with your operations.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((message, index) => {
                const isHuman = message.from === "Human";

                return (
                  <div
                    key={index}
                    className={`flex gap-3 ${
                      isHuman ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isHuman && (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-white">
                        <RobotIcon size={17} weight="fill" />
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        isHuman
                          ? "rounded-br-md bg-black text-white"
                          : "rounded-bl-md border bg-muted/40 text-foreground"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    {isHuman && (
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
                        <UserIcon size={17} weight="fill" />
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 px-6 pb-1">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border bg-background p-2 shadow-sm">
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask anything"
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          <button
            type="button"
            onClick={handleSendMessage}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-black text-white transition-opacity hover:opacity-80"
          >
            <ArrowUpIcon size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
