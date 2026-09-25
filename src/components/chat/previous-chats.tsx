import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import type { Chat } from "@/types";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { useSearchParams } from "react-router";
import { BACKEND_URL } from "@/utils/backend-url";

function PreviousChats() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    
    const [, setSearchParams] = useSearchParams();

    useEffect(() => {
        (async function () {
            if (!open) return;
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(`${BACKEND_URL}/api/chat`, {
                    method: "GET",
                    credentials: "include",
                });
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Failed to fetch chats");
                }
                setChats(result.data);
            } catch (error) {
                console.log("error", error);
                setError(
                    error instanceof Error ? error.message : "Failed to fetch chats",
                );
            } finally {
                setIsLoading(false);
            }
        })();
    }, [open]);

    return (
        <div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                    Previous Chats
                </SheetTrigger>

                <SheetContent className="flex w-full flex-col sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Previous Chats</SheetTitle>
                        <SheetDescription>
                            Select a conversation to continue where you left off.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="min-h-0 flex-1 overflow-y-auto py-4">
                        {isLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <Spinner />
                            </div>
                        ) : error ? (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        ) : chats.length === 0 ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <p className="text-sm font-medium">
                                        No previous chats
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Your conversations will appear here.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 px-3">
                                {chats.map((chat) => (
                                    <SheetClose
                                        onClick={() => {
                                            setSearchParams({ chatId: chat.id });
                                        }}
                                        key={chat.id}
                                        type="button"
                                        className="flex w-full flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted"
                                    >
                                        <span className="w-full truncate text-sm font-medium">
                                            {chat.title}
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                            {new Date(
                                                chat.updatedAt,
                                            ).toLocaleString()}
                                        </span>
                                    </SheetClose>
                                ))}
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default PreviousChats;
