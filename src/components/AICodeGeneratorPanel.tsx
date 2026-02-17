"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { AlertCircle, Sparkles, Send } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import { generateCodeWithGemini } from "../services/geminiService"
import { useGeminiConfig } from "../hooks/useGeminiConfig"

interface AICodeGeneratorPanelProps {
  onCodeGenerated: (code: string) => void
  onError?: (error: string) => void
}

export function AICodeGeneratorPanel({ onCodeGenerated, onError }: AICodeGeneratorPanelProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [config] = useGeminiConfig()

  const handleGenerateCode = async () => {
    if (!prompt.trim()) return
    if (!config.apiKey) {
      setError("Gemini API key not configured. Please set it in settings.")
      onError?.(error || "")
      return
    }

    setIsGenerating(true)
    setProgress(0)
    setError(null)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const code = await generateCodeWithGemini(prompt, config.apiKey)

      clearInterval(progressInterval)
      setProgress(100)

      onCodeGenerated(code)
      setPrompt("")

      // Reset progress after a delay
      setTimeout(() => setProgress(0), 1000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to generate code"
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!config.apiKey) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            API Not Configured
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-orange-800 mb-3">
            Gemini API key is required to use AI code generation. Please configure it in settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          AI Code Generator
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-3">
          <Textarea
            placeholder="Describe what you want to build... e.g., 'Create a modern login form with email and password fields'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-1 resize-none text-xs"
          />

          <Button
            onClick={handleGenerateCode}
            disabled={!prompt.trim() || isGenerating}
            size="sm"
            className="w-full flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>Generating code...</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="text-xs ml-2">{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
