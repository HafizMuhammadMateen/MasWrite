"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaRegEye, FaUpload } from "react-icons/fa";



export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: "",
    immediatelyRender: false,
  });

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
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <FaUpload /> {loading ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
      
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
  );
}
