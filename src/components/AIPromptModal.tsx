"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles, Send } from "lucide-react"

interface AIPromptModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (prompt: string) => Promise<void>
  isGenerating?: boolean
  generationProgress?: number
}

export function AIPromptModal({
  isOpen,
  onClose,
  onGenerate,
  isGenerating = false,
  generationProgress = 0,
}: AIPromptModalProps) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    try {
      await onGenerate(prompt)
      setPrompt("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleGenerate()
    }
  }

  const suggestedPrompts = [
    "Landing page for a SaaS product with hero section and pricing",
    "E-commerce product page with reviews and related items",
    "Blog homepage with featured posts and categories",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-0 bg-background p-0 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Build UI with AI</h2>
            </div>
            <p className="text-sm text-muted-foreground">Describe your vision and watch it come to life instantly</p>
          </div>

          {/* Main input section */}
          <div className="space-y-4 mb-6">
            <Textarea
              placeholder="Describe the UI you want to build... (e.g., 'Create a modern SaaS landing page with a hero section, feature grid, pricing table, and testimonials')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || isGenerating}
              className="min-h-[140px] resize-none bg-muted/30 border-border text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all text-base leading-relaxed"
            />

            {/* Progress bar */}
            {isGenerating && (
              <div className="space-y-3 p-4 bg-muted/40 rounded-lg border border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    Generating your UI and code...
                  </span>
                  <span className="text-xs text-blue-500 font-semibold">{Math.round(generationProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 shadow-lg shadow-blue-500/50"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {!isGenerating && prompt.length === 0 && (
            <div className="mb-6">
              <p className="text-xs text-muted-foreground font-medium mb-3">Quick prompts:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedPrompts.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(suggestion)}
                    className="text-left p-3 rounded-lg border border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg mb-6">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-blue-600">Tip:</span> Be specific about layout, colors, components,
              and desired features for best results. Use Ctrl+Enter to generate.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading || isGenerating}
              className="px-6 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isLoading || isGenerating}
              className="px-8 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading || isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Generate Design
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
