"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EditorContent } from "@tiptap/react"
import toast from "react-hot-toast"
import LinkModal from "@/components/modals/LinkModal"
import ImageModal from "@/components/modals/ImageModal"
import CategorySelector from "@/components/blogs/CategorySelector"
import TagsInput from "@/components/blogs/TagsInput"
import StatusSelector from "@/components/blogs/StatusSelector"
import ToolbarButton from "@/components/blogs/ToolbarButton"
import EditorHeader from "@/components/blogs/EditorHeader"
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
import type { Blog } from "@/lib/types/blog"

interface BlogEditorProps {
  initialData?: Blog
  slug?: string
}

export default function BlogEditor({ initialData, slug }: BlogEditorProps) {
  const isEdit = Boolean(slug)
  const router = useRouter()

  const [title, setTitle] = useState(initialData?.title ?? "")
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [category, setCategory] = useState(initialData?.category ?? "Web Development")
  const [status, setStatus] = useState(initialData?.status ?? "draft")
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [loading, setLoading] = useState<null | "draft" | "published" | "updating">(null)

  const editor = useTiptapEditor()

  // Populate editor content when editing
  useEffect(() => {
    if (initialData?.content && editor) {
      editor.commands.setContent(initialData.content)
    }
  }, [initialData, editor])

  // Auto-focus editor on mount
  useEffect(() => {
    editor?.commands.focus("end")
  }, [editor])

  // Ctrl+K shortcut for links
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

  const validateForm = (): boolean => {
    if (!title.trim()) { toast.error("Please enter a title."); return false }
    if (title.trim().split(/\s+/).length > 10) { toast.error("Title should be less than 10 words."); return false }
    if (!tags.length) { toast.error("Please add at least one tag."); return false }
    if (!category) { toast.error("Please select a category."); return false }
    return true
  }

  const handleSave = async (saveStatus: "draft" | "published" | "updating") => {
    if (!validateForm()) return

    const content = editor?.getHTML() ?? ""
    setLoading(saveStatus)

    try {
      const res = await fetch(
        isEdit ? `/api/manage-blogs/${slug}` : "/api/manage-blogs",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, tags, category, status: isEdit ? status : saveStatus }),
        }
      )
      if (!res.ok) throw new Error("Failed to save blog")

      toast.success(isEdit ? "Blog updated successfully!" : saveStatus === "draft" ? "Draft saved!" : "Blog published!")
      router.push("/dashboard/manage-blogs")
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="h-full p-6 flex flex-col justify-center items-center overflow-hidden">
      <EditorHeader
        title={title}
        setTitle={setTitle}
        loading={loading}
        handleSave={handleSave}
        isEdit={isEdit}
      />

      <div className="w-full bg-white rounded-lg shadow-md p-6 flex flex-1 overflow-y-auto gap-6">
        {/* Editor section */}
        <div className="flex-1 flex flex-col">
          {editor && (
            <div className="flex flex-wrap gap-4 border-b pb-3 mb-4">
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")}>
                <BoldIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")}>
                <ItalicIcon className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")}>
                <UnderlineIcon className="w-4 h-4" />
              </ToolbarButton>

              {([1, 2, 3] as const).map((level) => (
                <ToolbarButton
                  key={level}
                  onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                  isActive={editor.isActive("heading", { level })}
                >
                  H<sub className="text-xs ml-0.5">{level}</sub>
                </ToolbarButton>
              ))}

              <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")}>
                <List className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")}>
                <ListOrdered className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive("taskList")}>
                <CheckSquare className="w-4 h-4" />
              </ToolbarButton>

              <ToolbarButton onClick={() => setShowLinkModal(true)} isActive={editor.isActive("link")} title="Insert Link (Ctrl+K)">
                <LinkIcon className="w-4 h-4" />
              </ToolbarButton>
              {showLinkModal && <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />}

              <ToolbarButton onClick={() => setShowImageModal(true)}>
                <ImageIcon className="w-4 h-4" />
              </ToolbarButton>
              {showImageModal && <ImageModal editor={editor} open={showImageModal} onClose={() => setShowImageModal(false)} />}

              <ToolbarButton onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 className="w-4 h-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 className="w-4 h-4" />
              </ToolbarButton>
            </div>
          )}

          <div
            className="flex flex-1 overflow-y-auto border rounded-md p-4 cursor-text prose prose-sm sm:prose lg:prose-lg w-full max-w-none"
            onClick={() => editor?.chain().focus().run()}
          >
            <EditorContent editor={editor} className="w-full h-full outline-none focus:outline-none p-2" />
          </div>
        </div>

        {/* Sidebar: meta */}
        <div className="w-[30%] flex flex-col gap-6 border-l pl-6">
          <CategorySelector value={category} onChange={setCategory} />
          <TagsInput tags={tags} setTags={setTags} />
          {isEdit && <StatusSelector value={status} onChange={setStatus} />}
        </div>
      </div>
    </div>
  )
}
