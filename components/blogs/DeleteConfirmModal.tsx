"use client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  deleting = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete this blog? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3">
          <Button className="cursor-pointer" variant="outline" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={deleting}
            className="hover:bg-red-700 cursor-pointer"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="w-4 h-4 mr-1" />
                Yes, Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
