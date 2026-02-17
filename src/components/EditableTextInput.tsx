"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"

interface EditableTextInputProps {
  initialValue: string
  onSave: (value: string) => void
  onCancel: () => void
  isOpen: boolean
  position?: { x: number; y: number }
}

export function EditableTextInput({
  initialValue,
  onSave,
  onCancel,
  isOpen,
  position = { x: 0, y: 0 },
}: EditableTextInputProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isOpen])

  const handleSave = () => {
    if (value.trim()) {
      onSave(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      onCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-start pointer-events-none">
      <div
        className="absolute bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-700 pointer-events-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          minWidth: "300px",
          maxWidth: "500px",
        }}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-slate-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Edit Text</span>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-3 resize-none rounded-b-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white border-0 focus:outline-none focus:ring-0 placeholder-gray-400 dark:placeholder-gray-500"
          rows={4}
          placeholder="Enter text (Ctrl+Enter to save, Escape to cancel)"
        />
        <div className="flex gap-2 p-3 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
          <button
            onClick={handleSave}
            className="flex-1 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-2 rounded-md bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
