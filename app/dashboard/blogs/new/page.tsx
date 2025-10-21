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
import toast from "react-hot-toast";
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
  const isDev = process.env.NODE_ENV === "production";
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("Web Development");

  // Tag input handler
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };


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
    if (!title.trim()) return toast.error("Please enter a title.");
    if (!tags.length) return toast.error("Please add at least one tag.");
    if (!category) return toast.error("Please select a category.");

    const content = editor?.getText() || "";

    setLoading(true);

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        toast.success("Blog published successfully.");
        router.push("/dashboard/blogs");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to publish blog.");
      }
    } catch (err) {
      isDev && console.error("Publish error:", err);
      toast.error("Something went wrong while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-6 flex flex-col items-center overflow-hidden">
      {/* Title Bar */}
      <div className="w-full flex items-center justify-between mb-4 relative">
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

      {/* Editor + Sidebar */}
      <div className="w-full bg-white rounded-lg shadow-md p-6 flex flex-1 overflow-y-auto gap-6 ">
        {/* Left: Editor */}
        <div className="flex-1 flex flex-col">
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
            className="flex flex-1 overflow-y-auto border rounded-md p-4 cursor-text"
            onClick={() => editor?.chain().focus().run()}
          >
            <EditorContent
              editor={editor}
              className="w-full h-full outline-none focus:outline-none p-2"
            />
          </div>
        </div>

        {/* Right: Meta Panel (Tags + Category) */}
        <div className="w-[30%] flex flex-col gap-6 border-l pl-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[
                "Web Development",
                "UI/UX",
                "JavaScript",
                "React",
                "Next.js",
                "Backend",
                "Databases",
                "DevOps",
                "AI/ML",
                "Other",
              ].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-xs text-gray-600 hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              autoComplete="on"
              placeholder="Type and press Enter"
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

    </div>
  );
}