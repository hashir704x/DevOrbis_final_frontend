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

type DeleteTaskDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
};

function DeleteTaskDialog({ open, onOpenChange, onConfirm }: DeleteTaskDialogProps) {
    const [deleting, setDeleting] = useState(false);
    const handleConfirm = async () => {
        try {
            setDeleting(true);
            await onConfirm();
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
