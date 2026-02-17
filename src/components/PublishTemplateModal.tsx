"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { X, Lock, Globe } from "lucide-react"

interface PublishTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onPublish: (isPublic: boolean) => void
  buttonRef?: React.RefObject<HTMLButtonElement | null>
}

export function PublishTemplateModal({ isOpen, onClose, onPublish, buttonRef }: PublishTemplateModalProps) {
  const [visibility, setVisibility] = useState<"public" | "private">("public")

  if (!isOpen) return null

  // Calculate position near the button
  const getPosition = () => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      }
    }
    return { top: 60, right: 16 }
  }

  const position = getPosition()

  const handlePublish = () => {
    onPublish(visibility === "public")
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed z-50 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-200 dark:border-slate-800 w-80"
        style={{ top: position.top, right: position.right }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Publish as Template</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Choose who can see and use this template.</p>

          {/* Visibility Options */}
          <div className="space-y-2">
            {/* Public Option */}
            <button
              onClick={() => setVisibility("public")}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${visibility === "public"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                }`}
            >
              <div className="flex items-start gap-3">
                <Globe className={`w-5 h-5 mt-0.5 ${visibility === "public" ? "text-blue-600" : "text-gray-400"}`} />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Public</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Anyone can discover and use this template
                  </div>
                </div>
              </div>
            </button>

            {/* Private Option */}
            <button
              onClick={() => setVisibility("private")}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${visibility === "private"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600"
                }`}
            >
              <div className="flex items-start gap-3">
                <Lock className={`w-5 h-5 mt-0.5 ${visibility === "private" ? "text-blue-600" : "text-gray-400"}`} />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Private</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Only you can access this template</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700 text-white">
            Publish Template
          </Button>
        </div>
      </div>
    </>
  )
}
