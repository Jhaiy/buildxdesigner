"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Badge } from "./ui/badge"
import { Send, Bot, User, Code, Database, Palette, Layout, Sparkles, Copy, Check, AlertCircle } from "lucide-react"
import { generateAIResponse } from "../services/openaiService"

interface AIAssistantModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  type: "user" | "assistant" | "error"
  content: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  {
    category: "Design",
    icon: Palette,
    questions: [
      "How do I create a responsive navigation bar?",
      "What are the best color combinations for my website?",
      "How can I make my design more modern?",
      "What typography should I use for better readability?",
    ],
  },
  {
    category: "Layout",
    icon: Layout,
    questions: [
      "How do I center content on my page?",
      "What's the best way to create a grid layout?",
      "How can I make my website mobile-friendly?",
      "What are some common layout patterns?",
    ],
  },
  {
    category: "Code",
    icon: Code,
    questions: [
      "How do I add animations to my components?",
      "What's the difference between CSS Grid and Flexbox?",
      "How can I optimize my website's performance?",
      "How do I add interactive hover effects?",
    ],
  },
  {
    category: "Backend",
    icon: Database,
    questions: [
      "How do I connect my frontend to a database?",
      "What's the best way to handle user authentication?",
      "How do I create RESTful API endpoints?",
      "What database should I choose for my project?",
    ],
  },
]

export function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hello! I'm your FullDev AI Assistant. I can help you with web development questions, design advice, code implementation, and backend architecture. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string>("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedKey = localStorage.getItem("openai-api-key")
    if (savedKey) {
      setApiKey(savedKey)
    } else {
      setShowApiKeyInput(true)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    if (!apiKey) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: "error",
        content: "Please configure your OpenAI API key first.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setShowApiKeyInput(true)
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await generateAIResponse(inputMessage, apiKey)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("[v0] Error generating response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "error",
        content: `Error: ${error instanceof Error ? error.message : "Failed to generate response"}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      inputRef.current?.focus()
    }
  }

  const handleQuestionClick = (question: string) => {
    setInputMessage(question)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessage(messageId)
      setTimeout(() => setCopiedMessage(null), 2000)
    } catch (err) {
      console.error("Failed to copy message:", err)
    }
  }

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai-api-key", apiKey)
      setShowApiKeyInput(false)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            AI Assistant
          </DialogTitle>
        </DialogHeader>

        {showApiKeyInput && (
          <Card className="border-blue-500/50 bg-blue-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-3">Configure OpenAI API Key</p>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleSaveApiKey}>
                      Save
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Get your API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      platform.openai.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex-1 flex gap-4 min-h-0">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.type === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : message.type === "error"
                            ? "bg-red-50 border border-red-200"
                            : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div
                        className={`flex items-center gap-2 mt-2 ${
                          message.type === "user" ? "justify-end" : "justify-between"
                        }`}
                      >
                        <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
                        {message.type === "assistant" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={() => copyToClipboard(message.content, message.id)}
                          >
                            {copiedMessage === message.id ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {message.type === "user" && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="mt-4 flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about web development..."
                className="flex-1"
                disabled={isTyping || !apiKey}
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping || !apiKey} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" />

          {/* Suggestions Sidebar */}
          <div className="w-80 space-y-4">
            <div>
              <h3 className="font-medium mb-3">Suggested Questions</h3>
              <div className="space-y-4">
                {SUGGESTED_QUESTIONS.map((category) => (
                  <Card key={category.category}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <category.icon className="w-4 h-4 text-primary" />
                        <Badge variant="secondary">{category.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        {category.questions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuestionClick(question)}
                            className="text-left text-sm text-muted-foreground hover:text-foreground transition-colors block w-full p-2 rounded hover:bg-muted/50"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
