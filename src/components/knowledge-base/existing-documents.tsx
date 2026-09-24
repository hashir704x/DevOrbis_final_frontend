import {
    DownloadSimpleIcon,
    FileDocIcon,
    FileTextIcon,
    FilePdfIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
// import { toast } from "@/components/ui/toast";
import { Spinner } from "../ui/spinner";
import type { Document } from "@/types";

function ExistingDocuments() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>();

    function getFileIcon(fileType: string) {
        if (fileType === "application/pdf") {
            return <FilePdfIcon size={24} weight="regular" />;
        }
        if (
            fileType ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            return <FileDocIcon size={24} weight="regular" />;
        }
        return <FileTextIcon size={24} weight="regular" />;
    }
    function formatFileSize(size: number) {
        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(0)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    }
    function formatDate(date: string) {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(date));
    }

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(
                    "http://localhost:3000/api/documents/get-documents",
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                const result = await response.json();
                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to fetch documents");
                }
                setDocuments(result.data);
            } catch (error) {
                console.error("Failed to fetch documents:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading documents.",
                );
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <div className="flex min-h-64 items-center justify-center rounded-2xl bg-muted/40">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Spinner className="size-10" />
                        <p className="text-sm text-muted-foreground">
                            Loading documents
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto w-full max-w-4xl">
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-muted/40 px-6 text-center">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-foreground text-background">
                        <WarningCircleIcon size={24} />
                    </div>
                    <h3 className="text-sm font-semibold">
                        Unable to load documents
                    </h3>
                    <p className="mt-1 max-w-md text-sm text-red-600 foreground">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Existing Documents
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Documents currently available in your knowledge base.
                    </p>
                </div>

                <div className="shrink-0 rounded-full bg-muted px-3 py-1.5 text-xs font-medium">
                    {documents.length}{" "}
                    {documents.length === 1 ? "document" : "documents"}
                </div>
            </div>

            {documents.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl bg-muted/40 px-6 text-center">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-background shadow-sm">
                        <FileTextIcon size={24} />
                    </div>

                    <h3 className="text-sm font-semibold">No documents yet</h3>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        Upload your first document to start building the knowledge
                        base.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
                    {documents.map((document, index) => (
                        <div
                            key={document.id}
                            className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30 ${
                                index !== documents.length - 1 ? "border-b" : ""
                            }`}
                        >
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                                {getFileIcon(document.fileType)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p
                                    className="truncate text-sm font-medium"
                                    title={document.filename}
                                >
                                    {document.filename}
                                </p>

                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{formatFileSize(document.fileSize)}</span>
                                    <span>•</span>
                                    <span>{formatDate(document.createdAt)}</span>
                                </div>
                            </div>

                            <div className="shrink-0">
                                {document.status === "processing" && (
                                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                        Processing
                                    </span>
                                )}

                                {document.status === "success" && (
                                    <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
                                        Success
                                    </span>
                                )}

                                {document.status === "failed" && (
                                    <span className="rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                                        Failed
                                    </span>
                                )}
                            </div>

                            <a
                                href={document.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-background shadow-sm transition-opacity hover:opacity-85"
                            >
                                <DownloadSimpleIcon size={17} />
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExistingDocuments;
