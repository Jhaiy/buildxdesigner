"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "./ui/button"
import {
  Copy,
  ChevronRight,
  ChevronDown,
  File,
  Save,
  Edit,
  Link as LinkIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism"

// --- VS CODE DARK MODERN THEME OVERRIDES ---
const customSyntaxTheme = {
  ...okaidia,
  'comment': { color: "#6a9955", fontStyle: "italic" },
  'prolog': { color: "#6a9955" },
  'doctype': { color: "#6a9955" },
  'punctuation': { color: "#d4d4d4" },
  'namespace': { opacity: .7 },
  'property': { color: "#9cdcfe" },
  'tag': { color: "#569cd6" },
  'boolean': { color: "#569cd6" },
  'number': { color: "#b5cea8" },
  'constant': { color: "#9cdcfe" },
  'symbol': { color: "#b5cea8" },
  'deleted': { color: "#ce9178" },
  'selector': { color: "#d7ba7d" },
  'attr-name': { color: "#9cdcfe" },
  'string': { color: "#ce9178" },
  'char': { color: "#ce9178" },
  'builtin': { color: "#4ec9b0" },
  'inserted': { color: "#b5cea8" },
  'operator': { color: "#d4d4d4" },
  'entity': { color: "#4ec9b0", cursor: "help" },
  'url': { color: "#9cdcfe" },
  'variable': { color: "#9cdcfe" },
  'atrule': { color: "#c586c0" },
  'attr-value': { color: "#ce9178" },
  'function': { color: "#dcdcaa" },
  'keyword': { color: "#c586c0" },
  'regex': { color: "#d16969" },
  'important': { color: "#569cd6", fontWeight: "bold" },
  'bold': { fontWeight: "bold" },
  'italic': { fontStyle: "italic" },
};

// --- TYPES & INTERFACES ---
export interface ComponentData {
  id: string
  type: string
  props: Record<string, any>
  style?: Record<string, any>
  position?: { x: number; y: number }
  children?: ComponentData[]
  page_id?: string
}

interface CodeViewEditorProps {
  components: ComponentData[]
  projectName?: string
  pages: { id: string; name: string; path: string }[]
  activePageId: string
  onCodeChange?: (newComponents: ComponentData[]) => void
}

interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
}

// --- ICONS & HELPERS ---
const PHPIcon = () => <span className="text-[10px] font-bold text-[#8892bf] shrink-0">PHP</span>

const camelToKebab = (value: string): string => value.replace(/([A-Z])/g, "-$1").toLowerCase()
const isUnitless = (key: string) => ["opacity", "zIndex", "fontWeight", "lineHeight", "flex", "order"].includes(key)
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "page"

const toCssInline = (style: Record<string, any> = {}): string =>
  Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${camelToKebab(key)}: ${typeof value === "number" && !isUnitless(key) ? `${value}px` : value}`)
    .join("; ")

// --- GENERATORS ---
const renderComponentToPHP = (component: ComponentData, depth = 0, nested = false): string => {
  const indent = "  ".repeat(depth)
  const position = component.position ?? { x: 0, y: 0 }
  const styles = {
    ...(nested ? {} : { position: "absolute", left: `${position.x}px`, top: `${position.y}px` }),
    ...(component.style ?? {}),
  }
  const styleAttr = toCssInline(styles)
  const attrs: string[] = styleAttr ? [`style="${styleAttr}"`] : []
  const props = component.props ?? {}
  const childOutput = (component.children ?? []).map((child) => renderComponentToPHP(child, depth + 1, true)).join("\n")

  switch (component.type) {
    case "heading": return `${indent}<h${Math.min(6, Math.max(1, Number(props.level || 1)))} ${attrs.join(" ")}>${props.content || props.text || "Heading"}</h${Math.min(6, Math.max(1, Number(props.level || 1)))}>`
    case "text": return `${indent}<p ${attrs.join(" ")}>${props.content || props.text || "Text"}</p>`
    case "button": return `${indent}<button type="button" ${attrs.join(" ")}>${props.content || props.text || props.label || "Button"}</button>`
    case "image": return `${indent}<img src="${props.src || "https://via.placeholder.com/320x180"}" alt="${props.alt || "Image"}" ${attrs.join(" ")} />`
    default: return `${indent}<div ${attrs.join(" ")}>\n${childOutput || `${indent}  ${props.content || props.text || component.type}`}\n${indent}</div>`
  }
}

const generatePagePHP = (components: ComponentData[], pageId: string): string => {
  const pageComponents = components.filter(c => c.page_id === pageId || c.page_id === 'all' || (!c.page_id && pageId === 'home'));
  const body = pageComponents.length ? pageComponents.map((comp) => renderComponentToPHP(comp, 1)).join("\n") : "  <div>Empty page.</div>"
  return `<?php\n/**\n * Auto-generated view for ${pageId}\n */\n?>\n<div class="canvas-container">\n${body}\n</div>\n`
}

const buildTreeFromPaths = (paths: string[]): FileNode[] => {
  const root: FileNode = { name: "root", type: "folder", path: "", children: [] }
  paths.forEach((path) => {
    const segments = path.split("/")
    let current = root
    segments.forEach((segment, index) => {
      const currentPath = segments.slice(0, index + 1).join("/")
      const isFile = index === segments.length - 1 && segment.includes(".")
      if (!current.children) current.children = []
      let node = current.children.find((item) => item.path === currentPath)
      if (!node) {
        node = { name: segment, type: isFile ? "file" : "folder", path: currentPath, children: isFile ? undefined : [] }
        current.children.push(node)
      }
      current = node
    })
  })
  return (root.children ?? []).sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1))
}

// --- MAIN COMPONENT ---
export function CodeViewEditor({ components, projectName = "php-builder", pages, activePageId }: CodeViewEditorProps) {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["app", "app/views", "public"]))
  const [fileContents, setFileContents] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    const activePage = pages.find(p => p.id === activePageId) || pages[0];
    const generated: Record<string, string> = {
      "public/index.php": `<?php require_once __DIR__ . '/../app/views/layout.php'; ?>`,
      "app/views/layout.php": `<?php // Layout for ${projectName} ?>`,
      "public/assets/css/styles.css": `* { box-sizing: border-box; }`,
      "README.md": `# ${projectName}`,
    };

    pages.forEach(page => {
      generated[`app/views/${slugify(page.name)}.php`] = generatePagePHP(components, page.id);
    });

    setFileContents(generated);
    if (!selectedFile || !generated[selectedFile]) {
      setSelectedFile(`app/views/${slugify(activePage.name)}.php`);
    }
  }, [components, projectName, pages, activePageId, selectedFile]);

  const fileStructure = useMemo(() => buildTreeFromPaths(Object.keys(fileContents)), [fileContents])

  const renderTree = (nodes: FileNode[], depth = 0): React.ReactNode =>
    nodes.map((node) => (
      <div key={node.path} className="group">
        <div 
          className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-muted/40 transition-colors ${selectedFile === node.path ? "bg-muted" : ""}`} 
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => { 
            if (node.type === "folder") { 
              const n = new Set(expandedFolders); 
              n.has(node.path) ? n.delete(node.path) : n.add(node.path); 
              setExpandedFolders(n); 
            } else { 
              setSelectedFile(node.path); 
              setIsEditing(false); 
            } 
          }}
        >
          {node.type === "folder" ? (expandedFolders.has(node.path) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />) : (
            node.path.endsWith(".php") ? <PHPIcon /> : <File className="w-3.5 h-3.5" />
          )}
          <span className="text-sm truncate flex-1">{node.name}</span>
          <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(node.path); toast.success("Path copied"); }} className="opacity-0 group-hover:opacity-100 p-1">
            <LinkIcon className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
        {node.type === "folder" && expandedFolders.has(node.path) && node.children && renderTree(node.children, depth + 1)}
      </div>
    ))

  return (
    <div className="w-full h-full flex gap-4 p-4">
      {/* Sidebar Explorer */}
      <div className="w-64 border rounded-md p-2 flex flex-col bg-card h-full">
        <div className="px-2 py-2 border-b mb-2 text-xs font-bold uppercase text-muted-foreground flex items-center justify-between">
          Explorer
          <File className="w-3 h-3 opacity-50" />
        </div>
        <div className="overflow-auto flex-1">{renderTree(fileStructure)}</div>
      </div>
      
      {/* Editor Surface */}
      <div className="flex-1 border rounded-md overflow-hidden flex flex-col bg-card h-full">
        <div className="px-3 py-2 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
             <span className="text-xs text-muted-foreground opacity-50 shrink-0">Viewing:</span>
             <span className="text-sm font-medium truncate">{selectedFile}</span>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <Button size="sm" onClick={() => { setFileContents({...fileContents, [selectedFile]: editContent}); setIsEditing(false); toast.success("Saved"); }}>
                <Save className="w-3 h-3 mr-1" />Save
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => { setIsEditing(true); setEditContent(fileContents[selectedFile]); }}>
                <Edit className="w-3 h-3 mr-1" />Edit
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(fileContents[selectedFile]); toast.success("Code copied"); }}>
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* EDITOR AREA - bg fills the remaining space */}
        <div className="flex-1 overflow-auto bg-[#1f1f1f]">
          {isEditing ? (
            <textarea 
              className="w-full h-full p-4 bg-transparent text-[#cccccc] font-mono text-sm outline-none resize-none" 
              value={editContent} 
              onChange={(e) => setEditContent(e.target.value)} 
              spellCheck={false}
            />
          ) : (
            <SyntaxHighlighter 
              language={selectedFile.endsWith(".css") ? "css" : "php"} 
              style={customSyntaxTheme} 
              showLineNumbers
              customStyle={{ 
                margin: 0, 
                padding: "20px",
                backgroundColor: "#1f1f1f", 
                fontSize: "13px",
                lineHeight: "1.5",
                minHeight: "100%" // Ensure the black/grey background fills the height
              }}
            >
              {fileContents[selectedFile] || "/* No content */"}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </div>
  )
}