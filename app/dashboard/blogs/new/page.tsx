"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EditorContent } from "@tiptap/react"
import toast from "react-hot-toast"
import LinkModal from "@/components/modals/LinkModal"
import ImageModal from "@/components/modals/ImageModal"
import CategorySelector from "@/components/blogs/CategorySelector"
import TagsInput from "@/components/blogs/TagsInput"
import ToolbarButton from "@/components/blogs/ToolbarButton"
import TitleInput from "@/components/blogs/NewBlogHeader"
import { useTiptapEditor } from "@/hooks/blogs/useTiptapEditor"
import {
  List,
  ListOrdered,
  CheckSquare,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "lucide-react"

export default function NewBlogPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState<null | "draft" | "published" | "updating">(null)
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState("Web Development")
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [, forceUpdate] = useState({})

  const editor = useTiptapEditor()

  useEffect(() => {
    if (!editor) return
    const update = () => forceUpdate({})
    editor.on("selectionUpdate", update)
    editor.on("update", update)
    return () => {
      editor.off("selectionUpdate", update)
      editor.off("update", update)
    }
  }, [editor])

  // auto-focus editor cursor
  useEffect(() => {
    editor?.commands.focus("end")
  }, [editor])

  // Ctrl + K shortcut for links
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setShowLinkModal(true)
      }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  const handleSave = async (status: "draft" | "published" | "updating") => {
    if (status === "updating") {
      // updating handled in edit page
    } else {
    if (!title.trim()) return toast.error("Please enter a title.");
    if (!tags.length) return toast.error("Please add at least one tag.");
    if (!category) return toast.error("Please select a category.");
    
    const content = editor?.getHTML() || "";
    
    setLoading(status);
      try {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags, category, status }),
        })

        if (!res.ok) throw new Error("Failed to save blog");
        toast.success(status === "draft" ? "Draft saved!" : "Blog published!");
        if (status === "published") router.push("/dashboard/blogs");
      } catch {
        toast.error("Something went wrong.");
      } finally {
        setLoading(null);
      }
    }
  }

  return (
    <div className="h-full p-6 flex flex-col justify-center items-center overflow-hidden">
      {/* Title + Buttons */}
      <TitleInput
        title={title}
        setTitle={setTitle}
        loading={loading}
        handleSave={handleSave}
      />

      {/* Editor + Meta Panel */}
      <div className="w-full bg-white rounded-lg shadow-md p-6 flex flex-1 overflow-y-auto gap-6">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-4 border-b pb-3 mb-4">
              {/* Text styles */}
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}>
                <BoldIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}>
                <ItalicIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")}>
                <UnderlineIcon className="w-4 h-4" />
              </ToolbarButton>

              {/* Headings */}
              {[1, 2, 3].map((level) => (
                <ToolbarButton
                  key={level}
                  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                  isActive={editor.isActive("heading", { level })}
                >
                  H<sub className="text-xs ml-0.5">{level}</sub>
                </ToolbarButton>
              ))}

              {/* Lists */}
              <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")}>
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")}>
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive("taskList")}>
                <CheckSquare className="w-4 h-4" />
              </ToolbarButton>

              {/* Link */}
              <ToolbarButton onClick={() => setShowLinkModal(true)} isActive={editor.isActive("link")} title="Insert Link (Ctrl + K)">
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              {showLinkModal && <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />}

              {/* Image */}
              <ToolbarButton onClick={() => setShowImageModal(true)}>
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
              {showImageModal && <ImageModal editor={editor} open={showImageModal} onClose={() => setShowImageModal(false)} />}

              {/* Undo / Redo */}
              <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 className="w-4 h-4" />
              </ToolbarButton>
            </div>
          )}

          {/* Main Editor */}
          <div
            className="flex flex-1 overflow-y-auto border rounded-md p-4 cursor-text prose prose-sm sm:prose lg:prose-lg w-full max-w-none"
            onClick={() => editor?.chain().focus().run()}
          >
            <EditorContent editor={editor} className="w-full h-full outline-none focus:outline-none p-2" />
          </div>
        </div>

        {/* Sidebar: Category + Tags */}
        <div className="w-[30%] flex flex-col gap-6 border-l pl-6">
          <CategorySelector value={category} onChange={setCategory} />
          <TagsInput tags={tags} setTags={setTags} />
        </div>
      </div>
    </div>
  )
}
