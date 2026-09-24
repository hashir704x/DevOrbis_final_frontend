import {
    FileArrowUpIcon,
    XIcon,
    UploadSimpleIcon,
    FileTextIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { Spinner } from "../ui/spinner";

const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function UploadDocuments() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        const maxSize = 10 * 1024 * 1024;
        if (!allowedTypes.includes(selectedFile.type)) {
            toast.add({
                type: "error",
                description: "Only PDF and DOCX files are allowed.",
            });
            e.target.value = "";
            return;
        }
        if (selectedFile.size > maxSize) {
            toast.add({
                type: "error",
                description: "File size must not exceed 10 MB.",
            });
            e.target.value = "";
            return;
        }
        setFile(selectedFile);
    }

    function handleRemoveFile() {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    async function handleUpload() {
        if (!file) {
            toast.add({
                type: "error",
                description: "Please select a document first.",
            });
            return;
        }
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append("document", file);
            const response = await fetch(
                "http://localhost:3000/api/documents/upload",
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                },
            );
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to upload document");
            }
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            toast.add({
                type: "success",
                description: "Document uploaded successfully",
            });
        } catch (error) {
            console.error("Document upload failed:", error);
            toast.add({
                type: "failure",
                description:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while uploading the document.",
            });
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="mx-auto w-full max-w-4xl">
            {!file ? (
                <div className="relative overflow-hidden rounded-2xl bg-muted/40">
                    <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-foreground/55" />
                    <div className="pointer-events-none absolute -left-20 -top-20 size-56 rounded-full bg-foreground/55" />
                    <div className="pointer-events-none absolute -right-20 -bottom-20 size-56 rounded-full bg-foreground/55" />

                    <label
                        htmlFor="document-upload"
                        className="group relative flex min-h-90 cursor-pointer flex-col items-center justify-center px-6 py-12 text-center"
                    >
                        <div className="mb-7 flex size-16 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm transition-transform duration-200 group-hover:-translate-y-1">
                            <FileArrowUpIcon size={30} weight="regular" />
                        </div>

                        <h3 className="text-base font-semibold">
                            Drop your document here
                        </h3>

                        <p className="mt-2 text-sm text-muted-foreground">
                            or click anywhere to browse your files
                        </p>

                        <div className="mt-7 inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2.5 text-sm font-medium shadow-sm transition-all group-hover:shadow-md">
                            <UploadSimpleIcon size={17} />
                            Choose file
                        </div>

                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <FileTextIcon size={15} />
                            <span>PDF, DOCX or TXT</span>
                            <span>·</span>
                            <span>Maximum 10 MB</span>
                        </div>

                        <input
                            ref={fileInputRef}
                            id="document-upload"
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            ) : (
                <div className="rounded-2xl bg-muted/40 px-6 py-5">
                    <div className="flex items-center justify-between gap-5">
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
                                <FileTextIcon size={23} />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {file.name}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>

                        <button
                            disabled={isUploading}
                            type="button"
                            onClick={handleRemoveFile}
                            className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground cursor-pointer"
                            aria-label="Remove file"
                        >
                            <XIcon size={24} />
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-7 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:opacity-90 disabled:pointer-events-none disabled:opacity-30"
                >
                    {isUploading ? (
                        <>
                            <Spinner />
                        </>
                    ) : (
                        <>
                            <UploadSimpleIcon size={18} />
                            Upload document
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default UploadDocuments;
