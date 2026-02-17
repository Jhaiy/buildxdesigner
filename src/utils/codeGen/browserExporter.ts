/**
 * Browser Exporter - Handles ZIP export for browser environments
 * Uses jszip and file-saver for client-side downloads
 */

import type { GeneratedFiles } from "./types"

export class BrowserExporter {
  /**
   * Export files as ZIP for browser download
   */
  async exportAsZip(files: GeneratedFiles, projectName = "website"): Promise<void> {
    try {
      // Dynamically import JSZip to avoid bundling issues
      const JSZip = (await import("jszip")).default
      const FileSaver = await import("file-saver")

      const zip = new JSZip()
      const sanitizedProjectName = projectName.replace(/[^a-z0-9-]/gi, "-").toLowerCase()

      // Add all files to ZIP
      Object.entries(files).forEach(([filePath, content]) => {
        zip.file(filePath, content)
      })

      // Generate and download
      const blob = await zip.generateAsync({ type: "blob" })
      FileSaver.saveAs(blob, `${sanitizedProjectName}.zip`)

      console.log("✓ Project exported successfully")
    } catch (error) {
      console.error("✗ Error exporting project:", error)
      throw new Error("Failed to export project as ZIP")
    }
  }

  /**
   * Export individual file for download
   */
  async downloadFile(content: string, filename: string, mimeType = "text/plain"): Promise<void> {
    try {
      const FileSaver = await import("file-saver")
      const blob = new Blob([content], { type: mimeType })
      FileSaver.saveAs(blob, filename)

      console.log(`✓ File downloaded: ${filename}`)
    } catch (error) {
      console.error("✗ Error downloading file:", error)
      throw new Error("Failed to download file")
    }
  }
}

export const createBrowserExporter = () => new BrowserExporter()
