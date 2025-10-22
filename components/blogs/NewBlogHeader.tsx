"use client"

import { useState } from "react"
import { FaRegEye, FaSave, FaUpload } from "react-icons/fa"

interface TitleInputProps {
  title: string
  setTitle: (val: string) => void
  loading: boolean
  handleSave: (status: "draft" | "published") => void
}

export default function TitleInput({ title, setTitle, loading, handleSave }: TitleInputProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="flex min-w-full justify-center items-end mb-6">
      {/* Title input */}
      <div className="relative w-full mr-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-b-2 border-gray-300 focus:outline-none text-3xl font-semibold pb-2 transition-colors"
        />
        <label
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-all duration-300 ${
            focused || title ? "text-sm -top-2 text-gray-700" : "text-2xl top-1/2"
          }`}
        >
          Title
        </label>
        <span
          className={`absolute bottom-0 left-1/2 h-[2px] bg-gray-600 transition-all transform -translate-x-1/2 ${
            focused ? "w-full" : "w-0"
          }`}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 cursor-pointer transition"
        >
          <FaRegEye className="text-gray-600" /> Preview
        </button>

        <button
          onClick={() => handleSave("draft")}
          disabled={loading}
          className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-md border transition-all duration-200 cursor-pointer
            ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
            } 
            border-blue-400 text-blue-600 bg-white active:scale-[0.97]`}
        >
          <FaSave className="text-blue-500" />
          {loading ? "Saving..." : "Save Draft"}
        </button>

        <button
          onClick={() => handleSave("published")}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          <FaUpload /> {loading ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  )
}
