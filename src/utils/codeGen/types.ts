/**
 * Core types for the code generation system
 * Defines interfaces for components, generators, and page data
 */

export interface ComponentProps {
  [key: string]: any
}

export interface Component {
  id: string
  type: string
  props: ComponentProps
  style?: Record<string, string | number>
  children?: Component[]
  order?: number
}

export interface PageData {
  pageName: string
  components: Component[]
  metadata?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}

export type SiteData = PageData[]

/**
 * Component Generator Interface
 * Each component type must implement these methods
 */
export interface ComponentGenerator {
  generateHTML: (component: Component) => string
  generateCSS: (component: Component) => string
  generateJS: (component: Component) => string
}

/**
 * Component Registry
 * Maps component types to their generators
 */
export type ComponentRegistry = Record<string, ComponentGenerator>

export interface GeneratedFiles {
  [key: string]: string
}

export interface ExportOptions {
  includeReadme?: boolean
  includePackageJson?: boolean
  minifyCSS?: boolean
  minifyJS?: boolean
}
