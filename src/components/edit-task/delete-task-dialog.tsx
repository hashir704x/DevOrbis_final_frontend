import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@phosphor-icons/react";
import { BACKEND_URL } from "@/utils/backend-url";
import { toast } from "../ui/toast";
import { useNavigate } from "react-router";
import type { role } from "@/types";

type DeleteTaskDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskId: string;
    role: role;
    setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function DeleteTaskDialog({
    open,
    onOpenChange,
    taskId,
    setDeleteDialogOpen,
    role,
}: DeleteTaskDialogProps) {
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const handleDeleteTask = async () => {
        try {
            const response = await fetch(
                `${BACKEND_URL}/api/tasks/delete-task/${taskId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                },
            );
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to delete task");
            }
            toast.add({
                type: "success",
                description: "Task deleted successfully.",
            });
            setDeleteDialogOpen(false);
            if (role === "admin") {
                navigate("/admin");
            } else {
                navigate("/staff");
            }
        } catch (error) {
            console.error("Failed to delete task:", error);
            if (error instanceof Error) {
                toast.add({
                    type: "error",
                    description: error.message,
                });
            } else {
                toast.add({
                    type: "error",
                    description: "Something went wrong while deleting the task.",
                });
            }
        }
    };
    const handleConfirm = async () => {
        try {
            setDeleting(true);
            await handleDeleteTask();
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Task?</DialogTitle>

                    <DialogDescription>
                        This action cannot be undone. This will permanently delete
                        this task and its associated data.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={deleting}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={deleting}
                        onClick={handleConfirm}
                    >
                        <TrashIcon className="size-4" />

                        {deleting ? "Deleting" : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteTaskDialog;
