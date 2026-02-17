/**
 * Project Exporter - Handles downloading projects as ZIP files
 * Generates complete, runnable websites ready to deploy
 */

import {
  generateEnhancedHTMLCode,
  generateEnhancedCSSCode,
  generateEnhancedJSCode,
  generateInteractionsJS,
  generatePackageJson,
  generateREADME,
} from "./enhancedCodeGenerator"
import type { ComponentData } from "../App"

interface ProjectFiles {
  [key: string]: string
}

export const generateProjectFiles = (components: ComponentData[], projectName = "web-project"): ProjectFiles => {
  return {
    "index.html": generateEnhancedHTMLCode(components, projectName),
    "css/style.css": generateEnhancedCSSCode(components, projectName),
    "js/main.js": generateEnhancedJSCode(components),
    "js/interactions.js": generateInteractionsJS(),
    "package.json": generatePackageJson(projectName),
    "README.md": generateREADME(projectName),
  }
}

export const downloadProjectAsZip = async (components: ComponentData[], projectName = "web-project") => {
  try {
    // Dynamically import JSZip
    const JSZip = (await import("jszip")).default

    const zip = new JSZip()
    const files = generateProjectFiles(components, projectName)

    // Add files to ZIP with proper folder structure
    Object.entries(files).forEach(([path, content]) => {
      const parts = path.split("/")
      let current: any = zip

      // Create nested folders
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current.folder(parts[i])) {
          current = current.folder(parts[i])
        } else {
          current = current.folder(parts[i])!
        }
      }

      // Add file to the final folder
      current.file(parts[parts.length - 1], content)
    })

    // Generate and download ZIP
    const blob = await zip.generateAsync({ type: "blob" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName.replace(/\s+/g, "-")}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error("Error downloading project:", error)
    return false
  }
}

// Download individual files
export const downloadFile = (content: string, filename: string, mimeType = "text/plain") => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
