/**
 * Style Manager - Converts component properties to CSS
 * This utility handles the conversion of design panel changes to CSS styles
 */

import type { ComponentData } from "../App"

export interface StyleConfig {
  id: string
  className: string
  styles: Record<string, any>
}

// Convert camelCase to kebab-case
export const toKebab = (str: string): string => {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

// Convert style object to CSS string
export const styleToCss = (style: Record<string, any>): string => {
  if (!style || typeof style !== "object") return ""

  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => {
      const cssKey = toKebab(key)
      // Handle special cases like boxShadow, border, etc.
      if (typeof value === "object") {
        return ""
      }
      return `${cssKey}: ${value};`
    })
    .filter((s) => s.length > 0)
    .join(" ")
}

// Generate CSS for all components
export const generateComponentCSS = (components: ComponentData[]): string => {
  const baseStyles = `/* ============================================
   Reset & Base Styles
   ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f8fafc;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* ============================================
   Base Component Styles
   ============================================ */
.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #64748b;
  color: white;
}

.btn-secondary:hover {
  background: #475569;
}

.heading {
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  margin: 0 0 16px;
  font-weight: 600;
  line-height: 1.2;
}

.subheading {
  font-size: clamp(0.875rem, 1.5vw, 1.25rem);
  font-weight: 500;
  color: #666;
}

.card {
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text {
  margin: 0 0 12px;
  line-height: 1.6;
  color: #444;
}

.input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.navbar {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.navbar-brand {
  font-size: 18px;
  font-weight: 600;
  color: #111;
}

.navbar-links {
  list-style: none;
  display: flex;
  gap: 32px;
}

.navbar-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar-links a:hover {
  color: #111;
}

/* ============================================
   Utility Classes
   ============================================ */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.gap-8 {
  gap: 32px;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.mt-4 {
  margin-top: 16px;
}

.mb-4 {
  margin-bottom: 16px;
}

.p-4 {
  padding: 16px;
}

.rounded {
  border-radius: 8px;
}

.shadow {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.hidden {
  display: none;
}

.visible {
  display: block;
}

/* ============================================
   Component-Specific Styles
   ============================================ */`

  const componentStyles = components
    .map((comp) => {
      const className = comp.props?.className || `component-${comp.type}-${comp.id || Math.random()}`

      if (comp.style && typeof comp.style === "object") {
        const cssProps = styleToCss(comp.style)
        if (cssProps) {
          return `.${className} {\n  ${cssProps.replace(/; /g, ";\n  ")}\n}`
        }
      }

      return ""
    })
    .filter((s) => s.length > 0)
    .join("\n\n")

  return `${baseStyles}

${componentStyles || "/* Add component-specific styles here */"}`
}

// Generate responsive CSS media queries
export const generateResponsiveCSS = (): string => {
  return `
/* ============================================
   Responsive Design
   ============================================ */
@media (max-width: 768px) {
  .container {
    padding: 16px;
  }

  .navbar {
    flex-direction: column;
    gap: 16px;
  }

  .navbar-links {
    flex-direction: column;
    gap: 16px;
  }

  .grid {
    grid-template-columns: 1fr !important;
  }

  .heading {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 12px;
  }

  .btn {
    width: 100%;
  }

  .card {
    padding: 12px;
  }
}
`
}
