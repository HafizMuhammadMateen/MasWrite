import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";

export function useTiptapEditor() {
  return useEditor({
    extensions: [
      Heading.configure({ levels: [1, 2, 3] }),
      StarterKit.configure({ heading: false }),
      Underline,
      Link.configure({ openOnClick: true }),
      BulletList,
      OrderedList,
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false }),
    ],
    content: "",
    immediatelyRender: false,
  });
}