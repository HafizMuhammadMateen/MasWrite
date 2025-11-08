"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FaRegCopy } from "react-icons/fa";

interface DublicateConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dublicating?: boolean;
}

export default function DublicateConfirmModal({
  open,
  onClose,
  onConfirm,
  dublicating = false,
}: DublicateConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Confirm Dublication
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            You're about to duplicate the selected blog(s). Do you want to continue?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-3">
          <Button className="cursor-pointer" variant="outline" onClick={onClose} disabled={dublicating}>
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={dublicating}
            className="text-sm cursor-pointer"
          >
            {dublicating ? (
              <>
                Dublicating
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                <FaRegCopy className="w-4 h-4" />
                Dublicate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
