/**
 * INTEGRATION EXAMPLE: How to use the modular code generation system
 *
 * This file shows how to integrate the code generator into your application.
 * You can copy this pattern into any component (e.g., CodeExportModal.tsx, export handlers, etc.)
 */

import { createSiteGenerator, createBrowserExporter } from "./index"
import type { PageData, SiteData } from "./types"
import { toast } from "sonner"

/**
 * Example: Convert builder components to PageData format
 */
export async function handleExportSite(components: any[], pageName = "home") {
  try {
    const pageData: PageData = {
      pageName,
      components: components.map((comp, idx) => ({
        id: comp.id || `comp-${idx}`,
        type: comp.type, // e.g., "header", "button", "section"
        props: {
          content: comp.props?.content,
          className: comp.props?.className,
          style: comp.style,
          // Add other relevant props from your builder
          ...comp.props,
        },
        order: idx,
      })),
      metadata: {
        title: `${pageName} Page`,
        description: "Generated page from builder",
      },
    }

    const siteData: SiteData = [pageData]

    const generator = createSiteGenerator()
    const files = generator.generateSiteFiles(siteData)

    const exporter = createBrowserExporter()
    await exporter.exportAsZip(files, "my-website")

    toast.success("Website exported successfully!")
  } catch (error) {
    console.error("Export failed:", error)
    toast.error("Failed to export website")
  }
}

/**
 * Example: Multi-page export
 */
export async function handleExportMultiPage(pagesData: Array<{ name: string; components: any[] }>) {
  try {
    const siteData: SiteData = pagesData.map(({ name, components }, pageIdx) => ({
      pageName: name,
      components: components.map((comp, idx) => ({
        id: comp.id || `${name}-comp-${idx}`,
        type: comp.type,
        props: { ...comp.props },
        order: idx,
      })),
      metadata: {
        title: name.charAt(0).toUpperCase() + name.slice(1),
      },
    }))

    const generator = createSiteGenerator()
    const files = generator.generateSiteFiles(siteData)

    const exporter = createBrowserExporter()
    await exporter.exportAsZip(files, "my-website-multi-page")

    toast.success("Multi-page website exported!")
  } catch (error) {
    console.error("Export failed:", error)
    toast.error("Failed to export website")
  }
}

/**
 * Example: Get code without exporting (for display in editor)
 */
export function getGeneratedCode(components: any[], pageName = "home") {
  const pageData: PageData = {
    pageName,
    components: components.map((comp, idx) => ({
      id: comp.id || `comp-${idx}`,
      type: comp.type,
      props: { ...comp.props },
      order: idx,
    })),
  }

  const generator = createSiteGenerator()
  const files = generator.generateSiteFiles([pageData])

  // Return the generated code
  return {
    html: files.html[`${pageName}.html`] || "",
    css: files.css[`${pageName}.css`] || "",
    js: files.js[`${pageName}.js`] || "",
  }
}
