"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageModalProps {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}

export default function ImageModal({ editor, open, onClose }: ImageModalProps) {
  const [imageURL, setImageURL] = useState("");

  const handleInsert = () => {
    if (!imageURL.trim()) return;
    editor.chain().focus().setImage({ src: imageURL }).run();
    onClose();
    setImageURL("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <Input
          type="url"
          placeholder="Paste image URL here"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInsert}>Insert</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}