"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaRegEye, FaUpload } from "react-icons/fa";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import BulletList from "@tiptap/extension-bullet-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import {
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";


export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: true,
      }),
      BulletList,
      TaskList,
      TaskItem,
      Image,
    ],
    content: "",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.focus("end"); // focus with blinking cursor
    }
  }, [editor]);

  // Toolbar button helper
  const Button = ({ onClick, isActive, children }: any) => (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-sm rounded transition cursor-pointer ${
        isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
      }`}
      type="button"
    >
      {children}
    </button>
  );

  // Handle publish click
  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Please enter a title before publishing.");
      return;
    }

    const content = editor?.getHTML() || "";

    setLoading(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        router.push("/dashboard/blogs");
      } else {
        const error = await res.json();
        alert(error.message || "Failed to publish blog.");
      }
    } catch (err) {
      console.error("Publish error:", err);
      alert("Something went wrong while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      {/* Title Bar */}
      <div className="w-full flex items-center justify-between mb-8 relative">
        {/* Title Input */}
        <div className="relative w-full mr-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent border-b-2 border-gray-300 focus:outline-none text-3xl font-semibold pb-2 transition-colors"
          />
          {/* Floating placeholder */}
          <label
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-300 ${
              focused || title
                ? "text-sm -top-2 pb-17 text-gray-700"
                : "text-2xl top-1/2"
            }`}
          >
            Title
          </label>

          {/* Bottom border animation */}
          <span
            className={`absolute bottom-0 left-1/2 h-[2px] bg-gray-600 transition-all duration-400 transform -translate-x-1/2 ${
              focused ? "w-full scale-x-100" : "w-0 scale-x-0"
            } origin-center`}
          ></span>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer  transition"
          >
            <FaRegEye className="text-gray-600" /> Preview
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <FaUpload /> {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-md p-6 flex flex-col h-[calc(100vh-180px)]">
        {/* Toolbar */}
        {editor && (
          <div className="flex flex-wrap gap-4 border-b pb-3 mb-4">
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
            >
              <b>B</b>
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
            >
              <i>I</i>
            </Button>
            <Button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
            >
              <u>U</u>
            </Button>

            {/* Headings */}
            {[1, 2, 3].map((level) => (
              <Button
                key={level}
                onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                isActive={editor.isActive("heading", { level })}
              >
                H<sub className="text-xs ml-0.5">{level}</sub>
              </Button>
            ))}

            {/* Lists */}
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive("bulletList")}
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive("orderedList")}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive("taskList")}
            >
              <CheckSquare className="w-4 h-4" />
            </Button>

            {/* Link */}
            <Button
              onClick={() => {
                const url = prompt("Enter link URL:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              isActive={editor.isActive("link")}
            >
              <LinkIcon className="w-4 h-4" />
            </Button>

            {/* Image */}
            <Button
              onClick={() => {
                const url = prompt("Enter image URL:");
                if (url) editor.chain().focus().setImage({ src: url }).run();
              }}
            >
              <ImageIcon className="w-4 h-4" />
            </Button>

            {/* Undo / Redo */}
            <Button onClick={() => editor.chain().focus().undo().run()}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button onClick={() => editor.chain().focus().redo().run()}>
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Actual Editor */}
        <div
          className="flex-1 overflow-y-auto border rounded-md p-4 cursor-text"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent
            editor={editor}
            className=" w-full border-none min-h-full outline-none focus:outline-none p-2"
          />
        </div>
      </div>

    </div>
  );
}