import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";

export function useTiptapEditor() {
  return useEditor({
    extensions: [
      // StarterKit already includes: Heading, BulletList, OrderedList, Bold, Italic, etc.
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false }),
    ],
    content: "",
    immediatelyRender: false,
  });
}
