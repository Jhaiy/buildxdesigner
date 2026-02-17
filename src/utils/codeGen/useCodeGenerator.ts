"use client"

import { useState, useEffect, useCallback } from "react"
import type { ComponentData } from "@/App"
import { createSiteGenerator, createBrowserExporter } from "./index"

export interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
  content?: string
}

/**
 * Hook that generates code files from components dynamically
 * Updates in real-time as components change
 */
export function useCodeGenerator(components: ComponentData[], projectName = "web-project") {
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [fileStructure, setFileStructure] = useState<FileNode[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      generateCode()
    }, 500) // Wait 500ms after last component change

    return () => clearTimeout(timer)
  }, [components, projectName])

  const sortComponentsByPosition = (comps: ComponentData[]): ComponentData[] => {
    return [...comps].sort((a, b) => {
      const aY = (a.position?.y || 0) + (a.props?.top || 0)
      const bY = (b.position?.y || 0) + (b.props?.top || 0)
      const aX = (a.position?.x || 0) + (a.props?.left || 0)
      const bX = (b.position?.x || 0) + (b.props?.left || 0)

      // Sort by Y position first (top to bottom)
      if (Math.abs(aY - bY) > 20) {
        return aY - bY
      }
      // If same Y level, sort by X position (left to right)
      return aX - bX
    })
  }

  const generateCode = useCallback(async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const sortedComponents = sortComponentsByPosition(components)

      const siteData = [
        {
          pageName: "index", // Changed to index for main page
          components: sortedComponents.map((comp, index) => ({
            id: comp.id,
            type: comp.type,
            props: comp.props || {},
            order: index, // Use sorted index
            style: comp.style || {},
            position: comp.position,
          })),
          metadata: {
            title: projectName,
            description: "Generated website",
          },
        },
      ]

      const generator = createSiteGenerator()
      const generatedFilesObject = generator.generateSiteFiles(siteData)

      if (!generatedFilesObject || typeof generatedFilesObject !== "object") {
        throw new Error("Invalid generated files structure")
      }

      const contents: Record<string, string> = {}
      const structure: FileNode[] = []

      // Organize files by folder
      const folders: Record<string, FileNode[]> = {}

      Object.entries(generatedFilesObject).forEach(([path, content]) => {
        if (typeof content !== "string") {
          console.warn("[v0] Skipping non-string content for:", path)
          return
        }

        contents[path] = content

        // Parse path to create folder structure
        const parts = path.split("/")
        if (parts.length > 1) {
          const folder = parts[0]
          if (!folders[folder]) {
            folders[folder] = []
          }
          folders[folder].push({
            name: parts[parts.length - 1],
            type: "file",
            path: path,
            content: content,
          })
        } else {
          // Root level files
          structure.push({
            name: path,
            type: "file",
            path: path,
            content: content,
          })
        }
      })

      // Build folder nodes
      Object.entries(folders).forEach(([folderName, files]) => {
        structure.push({
          name: folderName,
          type: "folder",
          path: folderName,
          children: files,
        })
      })

      setFileContents(contents)
      setFileStructure(structure)
      console.log("[v0] Code generated successfully:", Object.keys(contents).length, "files")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate code"
      setError(message)
      console.error("[v0] Code generation error:", message, err)
    } finally {
      setIsGenerating(false)
    }
  }, [components, projectName])

  const downloadAsZip = useCallback(
    async (fileName = `${projectName}.zip`) => {
      try {
        if (Object.keys(fileContents).length === 0) {
          setError("No files to export. Please add components first.")
          return false
        }

        const exporter = createBrowserExporter()
        await exporter.exportAsZip(fileContents, projectName)
        return true
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to export ZIP"
        setError(message)
        console.error("[v0] ZIP export error:", message, err)
        return false
      }
    },
    [fileContents, projectName],
  )

  return {
    fileContents,
    fileStructure,
    isGenerating,
    error,
    downloadAsZip,
    regenerate: generateCode,
  }
}
