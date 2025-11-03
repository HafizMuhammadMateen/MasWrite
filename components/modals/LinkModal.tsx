"use client";

import { useState } from "react";
import { Editor } from "@tiptap/react";

interface LinkModalProps {
  editor: Editor;
  onClose: () => void;
}

export default function LinkModal({ editor, onClose }: LinkModalProps) {
  const [linkURL, setLinkURL] = useState(
    editor.getAttributes("link")?.href || ""
  );

  const handleInsertLink = () => {
    if (!linkURL.trim()) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkURL, target: "_blank" })
      .run();

    onClose();
  };

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-3">Insert Link</h3>
        <input
          type="url"
          placeholder="https://example.com"
          className="border border-gray-300 p-2 w-full mb-4 rounded outline-none focus:ring focus:ring-blue-200"
          value={linkURL}
          onChange={(e) => setLinkURL(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          {editor.isActive("link") && (
            <button
              onClick={handleRemoveLink}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Remove
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleInsertLink}
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}