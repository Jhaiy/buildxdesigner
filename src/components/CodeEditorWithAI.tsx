"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { AICodeGeneratorPanel } from "./AICodeGeneratorPanel"
import { CodeEditor } from "./CodeEditor"
import { toast } from "sonner"

interface CodeEditorWithAIProps {
  fileName: string
  initialCode?: string
  onCodeChange?: (code: string) => void
}

export function CodeEditorWithAI({ fileName, initialCode = "", onCodeChange }: CodeEditorWithAIProps) {
  const [code, setCode] = useState(initialCode)
  const [activeTab, setActiveTab] = useState("editor")

  const handleCodeGenerated = (generatedCode: string) => {
    setCode(generatedCode)
    onCodeChange?.(generatedCode)
    toast.success("Code generated successfully!")
    setActiveTab("editor")
  }

  const handleError = (error: string) => {
    toast.error(`Error: ${error}`)
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="editor">Code Editor</TabsTrigger>
        <TabsTrigger value="ai">AI Generator</TabsTrigger>
      </TabsList>

      <TabsContent value="editor" className="flex-1 border-0">
        <CodeEditor fileName={fileName} code={code} onCodeChange={setCode} />
      </TabsContent>

      <TabsContent value="ai" className="flex-1 border-0">
        <div className="h-full p-4">
          <AICodeGeneratorPanel onCodeGenerated={handleCodeGenerated} onError={handleError} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
