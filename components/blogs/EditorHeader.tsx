"use client"

import { useState } from "react"
import { FaRegEye, FaSave, FaUpload } from "react-icons/fa"

interface EditorHeaderProps {
  title: string
  setTitle: (val: string) => void
  loading: null | "draft" | "published" | "updating"
  handleSave: (status: "draft" | "published" | "updating") => Promise<void | string>
  isEdit?: boolean
}

export default function EditorHeader({ 
  title, 
  setTitle, 
  loading, 
  handleSave, 
  isEdit = false 
}: EditorHeaderProps) {
  const [focused, setFocused] = useState(false)
  const TITLE_MAX_LENGHT = 100

  return (
    <div className="flex min-w-full justify-center items-start mb-6">
      {/* Title input */}
      <div className="relative w-full mr-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX_LENGHT))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none text-3xl font-semibold pb-2 transition-colors"
        />

        {/* Floating label */}
        <label
          className={`absolute left-0 text-gray-400 pointer-events-none transition-all duration-300
            ${
              focused || title
                ? "text-sm -top-5 text-gray-700"
                : "text-2xl top-[6px]" // anchor near input baseline, not centered
            }`}
        >
          Title
        </label>

        {/* Character counter */}
        <div
          className={`text-sm mt-1 text-right ${
            title.length >= TITLE_MAX_LENGHT ? "text-red-500" : "text-gray-500"
          }`}
        >
          {title.length}/{TITLE_MAX_LENGHT} characters
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {/* Preview Button */}
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer transition">
          <FaRegEye className="text-gray-600" /> Preview
        </button>

        {isEdit ? (
          // Edit Mode: Show Update Button
          <button
            onClick={() => handleSave("updating")}
            disabled={loading === "updating"}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <FaUpload /> {loading === "updating" ? "Updating..." : "Update"}
          </button>
        ) : (
          // Create Mode: Show Draft + Publish
          <>
            <button
              onClick={() => handleSave("draft")}
              disabled={loading === "draft"}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-md border transition-all duration-200 cursor-pointer
                ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                } 
                border-blue-400 text-blue-600 bg-white active:scale-[0.97]`}
            >
              <FaSave className="text-blue-500" />
              {loading === "draft" ? "Saving..." : "Save Draft"}
            </button>

            <button
              onClick={() => handleSave("published")}
              disabled={loading === "published"}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <FaUpload /> {loading === "published" ? "Publishing..." : "Publish"}
            </button>
          </>
        )}
      </div>
    </div>
  )
}