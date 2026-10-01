import { useState } from "react";
import UploadDocuments from "@/components/knowledge-base/upload-documents";
import ExistingDocuments from "@/components/knowledge-base/existing-documents";

function KnowledgeBase() {
    const [activeTab, setActiveTab] = useState<"upload" | "documents">("upload");
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Knowledge Base</h1>
                <p className="text-muted-foreground">
                    Manage the documents used by your AI system.
                </p>
            </div>

            <div className="flex gap-2 border-b">
                <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`border-b-2 px-4 py-2 text-sm font-medium ${
                        activeTab === "upload"
                            ? "border-black text-black"
                            : "border-transparent text-muted-foreground"
                    }`}
                >
                    Upload Document
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("documents")}
                    className={`border-b-2 px-4 py-2 text-sm font-medium ${
                        activeTab === "documents"
                            ? "border-black text-black"
                            : "border-transparent text-muted-foreground"
                    }`}
                >
                    Existing Documents
                </button>
            </div>

            {activeTab === "upload" && <UploadDocuments />}

            {activeTab === "documents" && <ExistingDocuments />}
        </div>
    );
}

export default KnowledgeBase;
