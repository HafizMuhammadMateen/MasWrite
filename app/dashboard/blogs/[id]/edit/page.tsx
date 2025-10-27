"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Blog } from "@/lib/types/blog"
import StatusSelector from "@/components/blogs/StatusSelector"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const [title, setTitle] = useState("")
  const [loading, setLoading] = useState<null | "updating">(null)
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState("Web Development")
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [status, setStatus] = useState("draft")
  const editor = useTiptapEditor()

  // Fetch blog data and populate fields
  useEffect(() => {
    if (!params.id) return;
    
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${params.id}`)
        const data: Blog = await res.json()
        setTitle(data.title)
        setTags(data.tags || [])
        setCategory(data.category || "Web Development")
        editor?.commands.setContent(data.content || "")
      } catch (err) {
        console.error("Failed to fetch blog", err)
      }
    }
    fetchBlog()
  }, [params.id, editor])

  // Editor toolbar re-render
  useEffect(() => {
    if (!editor) return
    const update = () => {}
    editor.on("selectionUpdate", update)
    editor.on("update", update)
    return () => {
      editor.off("selectionUpdate", update)
      editor.off("update", update)
    }
  }, [editor])

  // Ctrl + K for link
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

  const handleUpdate = async () => {
    if (!title.trim()) return toast.error("Please enter a title.");
    
    const words = title.trim().split(/\s+/).length;
    if (words > 10) return toast.error("Title should be less than 10 words.");
    
    if (!tags.length) return toast.error("Please add at least one tag.");
    if (!category) return toast.error("Please select a category.");

    const content = editor?.getHTML() || ""
    setLoading("updating")

    try {
      const res = await fetch(`/api/blogs/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, tags, category, status }),
      })
      if (!res.ok) throw new Error("Failed to update blog");
      toast.success("Blog updated successfully!");
      router.push("/dashboard/blogs");
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="h-full p-6 flex flex-col justify-center items-center overflow-hidden">
      {/* Title + Buttons */}
      <TitleInput
        title={title}
        setTitle={setTitle}
        loading={loading}
        handleSave={handleUpdate}
        isEdit={true}
      />

      {/* Editor + Sidebar */}
      <div className="w-full bg-white rounded-lg shadow-md p-6 flex flex-1 overflow-y-auto gap-6">
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-4 border-b pb-3 mb-4">
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}><BoldIcon className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}><ItalicIcon className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")}><UnderlineIcon className="w-4 h-4" /></ToolbarButton>
              {[1, 2, 3].map(l => <ToolbarButton key={l} onClick={() => editor.chain().focus().toggleHeading({ level: l }).run()} isActive={editor.isActive("heading", { level: l })}>H<sub className="text-xs">{l}</sub></ToolbarButton>)}
              <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")}><List className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")}><ListOrdered className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive("taskList")}><CheckSquare className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton onClick={() => setShowLinkModal(true)} isActive={editor.isActive("link")}><LinkIcon className="w-4 h-4" /></ToolbarButton>
              {showLinkModal && <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />}
              <ToolbarButton onClick={() => setShowImageModal(true)}><ImageIcon className="w-4 h-4" /></ToolbarButton>
              {showImageModal && <ImageModal editor={editor} open={showImageModal} onClose={() => setShowImageModal(false)} />}
              <ToolbarButton onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></ToolbarButton>
            </div>
          )}

          {/* Editor */}
          <div className="flex flex-1 overflow-y-auto border rounded-md p-4 cursor-text prose w-full max-w-none" onClick={() => editor?.chain().focus().run()}>
            <EditorContent editor={editor} className="w-full h-full outline-none" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-[30%] flex flex-col gap-6 border-l pl-6">
          <CategorySelector value={category} onChange={setCategory} />
          <TagsInput tags={tags} setTags={setTags} />
          <StatusSelector value={status} onChange={setStatus} />
        </div>
      </div>
    </div>
  )
}
