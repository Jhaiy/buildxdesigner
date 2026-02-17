"use client"

import { useState } from "react"

export interface GeminiConfig {
  apiKey: string
  isConfigured: boolean
}

export function useGeminiConfig(): [GeminiConfig, (config: Partial<GeminiConfig>) => void] {
  const STORAGE_KEY = "gemini-config"

  const [config, setConfig] = useState<GeminiConfig>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return { apiKey: "", isConfigured: false }
      }
    }
    return { apiKey: "", isConfigured: false }
  })

  const updateConfig = (updates: Partial<GeminiConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
  }

  return [config, updateConfig]
}
