"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Label } from "./ui/label"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"
import { useGeminiConfig } from "../hooks/useGeminiConfig"
import { toast } from "sonner"

interface GeminiConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GeminiConfigModal({ open, onOpenChange }: GeminiConfigModalProps) {
  const [config, updateConfig] = useGeminiConfig()
  const [apiKey, setApiKey] = useState(config.apiKey)
  const [showKey, setShowKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSave = () => {
    updateConfig({ apiKey, isConfigured: !!apiKey })
    toast.success("API key saved")
    onOpenChange(false)
  }

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: "Please enter an API key" })
      return
    }

    setIsTesting(true)
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "Hello" }] }],
            generationConfig: { maxOutputTokens: 10 },
          }),
        },
      )

      if (response.ok) {
        setTestResult({ success: true, message: "API key is valid!" })
      } else {
        const error = await response.json()
        setTestResult({ success: false, message: `Invalid API key: ${error.error?.message}` })
      }
    } catch (err) {
      setTestResult({ success: false, message: "Connection failed. Check your API key." })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Gemini API</DialogTitle>
          <DialogDescription>Add your Google Gemini API key to enable AI-powered code generation</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">
              Get your free API key from{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:no-underline"
              >
                Google AI Studio
              </a>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {testResult && (
            <Alert variant={testResult.success ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs ml-2">{testResult.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleTest} disabled={isTesting || !apiKey.trim()} size="sm">
            {isTesting ? "Testing..." : "Test Key"}
          </Button>
          <Button onClick={handleSave} size="sm">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
