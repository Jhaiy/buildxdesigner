"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Send, Bot, User, Sparkles, MessageSquare } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AIAssistantProps {
  selectedComponentType?: string
}

export function AIAssistant({ selectedComponentType }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: `Hello! I'm your AI design assistant. I can help you with:\n\n• Component customization and styling\n• Design best practices and suggestions\n• HTML/CSS code generation\n• Layout and responsiveness tips\n\nWhat would you like to work on today?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage: string): Promise<string> => {
    
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    const responses = [
      `For ${selectedComponentType || "your component"}, I recommend focusing on accessibility and user experience. Consider adding proper contrast ratios and semantic HTML structure.`,

      `Here are some styling suggestions for your ${selectedComponentType || "component"}:\n\n• Use consistent spacing (8px, 16px, 24px)\n• Consider hover and focus states\n• Ensure mobile responsiveness\n• Add subtle animations for better UX`,

      `I can help you optimize this ${selectedComponentType || "component"}. Would you like me to suggest specific CSS properties or help with the layout structure?`,

      `For better design consistency:\n\n• Use your design system's color palette\n• Maintain consistent typography scale\n• Apply proper spacing hierarchy\n• Consider the component's context in the overall layout`,

      `Let me help you with that! Here's what I suggest:\n\n1. Start with a mobile-first approach\n2. Use semantic HTML elements\n3. Apply progressive enhancement\n4. Test across different devices\n\nWould you like specific code examples?`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await generateResponse(userMessage.content)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessage = (content: string) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))
  }

  return (
    <Card className="border-t border-l-0 border-r-0 border-b-0 rounded-none mt-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </span>
            {selectedComponentType && (
              <Badge variant="secondary" className="text-xs bg-white/60 dark:bg-black/20">
                {selectedComponentType}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Messages */}
        <div id="ai-assistant-chat" className="h-[calc(100vh-400px)] overflow-y-auto px-4" style={{ scrollbarWidth: "thin" }}>
          <div className="space-y-3 py-2">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-2">
                <div className="flex-shrink-0 mt-1">
                  {message.type === "assistant" ? (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center shadow-sm">
                      <User className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`rounded-lg transition-all duration-200 ${
                      message.type === "assistant"
                        ? "bg-white/80 dark:bg-black/20 text-foreground border border-blue-100 dark:border-blue-900/50 p-3 text-sm"
                        : "bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-8 shadow-sm p-2 text-xs"
                    }`}
                  >
                    {formatMessage(message.content)}
                  </div>
                  <div className={`text-xs text-muted-foreground mt-1 ${message.type === "user" ? "ml-8" : ""}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-white/80 dark:bg-black/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about design..."
              className="flex-1 bg-white/80 dark:bg-black/20 border-blue-200 dark:border-blue-800 focus:border-blue-400 dark:focus:border-blue-600"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-3 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            <MessageSquare className="w-3 h-3 inline mr-1" />
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
