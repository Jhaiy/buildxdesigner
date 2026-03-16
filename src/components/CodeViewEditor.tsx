"use client"

import type React from "react"
import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog"
import {
  Copy, ChevronRight, ChevronDown, File, Save, Pencil, X, Download,
  CheckCircle2, RefreshCw, AlertCircle, Plus, Trash2, FilePlus,
  FolderPlus, FileCode, FileText, Globe, RefreshCcw, AlertTriangle, Layers, Lock, Eye
} from "lucide-react"
import { toast } from "sonner"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { okaidia } from "react-syntax-highlighter/dist/esm/styles/prism"
import { generateProjectFiles, slugify } from "../lib/code-generator"

// --- TYPES ---
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
  onPageCreate?: (name: string, path: string) => void
}

interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
}

type FileOverrides = Record<string, string>

interface FileTypeOption { 
  ext: string; 
  label: string; 
  icon: React.ReactNode; 
  color: string; 
  folder: string; 
}

interface FileCreatorModalProps {
  onClose: () => void
  existingPaths: string[]
  onCreateFile: (path: string, content: string) => void
}

// --- VS CODE DARK MODERN THEME ---
const customSyntaxTheme = {
  ...okaidia,
  comment:     { color: "#6a9955", fontStyle: "italic" },
  punctuation: { color: "#d4d4d4" },
  property:    { color: "#9cdcfe" },
  tag:         { color: "#569cd6" },
  string:      { color: "#ce9178" },
  function:    { color: "#dcdcaa" },
  keyword:     { color: "#c586c0" },
}

const FILE_TEMPLATES: Record<string, (name: string) => string> = {
  php: (name) => `<?php\n// Backend logic for ${name}\nrequire_once __DIR__ . '/../lib/supabase.php';\n\n// Add your logic here\n`,
  js: (name) => `// ${name}.js logic\n`,
  json: (name) => `{\n  "name": "${name}"\n}\n`,
  md: (name) => `# ${name}\n`,
}

const FILE_TYPE_OPTIONS: FileTypeOption[] = [
  { ext: "php",  label: "PHP Script",   icon: <span className="text-[10px] font-bold text-[#8892bf]">PHP</span>,  color: "text-[#8892bf]", folder: "app/api" },
  { ext: "js",   label: "JavaScript",  icon: <span className="text-[10px] font-bold text-[#f7df1e]">JS</span>,   color: "text-[#f7df1e]", folder: "public/assets/js" },
  { ext: "json", label: "JSON Config", icon: <span className="text-[10px] font-bold text-[#f5a623]">JSON</span>, color: "text-[#f5a623]", folder: "app/config" },
  { ext: "md",   label: "Markdown",    icon: <span className="text-[10px] font-bold text-[#aaa]">MD</span>,      color: "text-[#aaa]",     folder: "docs" },
]

// --- COMPONENTS ---

function FileCreatorModal({ onClose, existingPaths, onCreateFile }: FileCreatorModalProps) {
  const [selectedType, setSelectedType] = useState<FileTypeOption>(FILE_TYPE_OPTIONS[0])
  const [fileName, setFileName]         = useState("")
  const [customFolder, setCustomFolder] = useState("")
  const [useCustomFolder, setUseCustomFolder] = useState(false)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 50) }, [])

  const folder     = useCustomFolder ? customFolder : selectedType.folder
  const cleanName  = fileName.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase()
  const finalPath  = cleanName ? `${folder}/${cleanName}.${selectedType.ext}` : ""

  const validate = () => {
    if (!cleanName) return "File name is required."
    if (existingPaths.includes(finalPath)) return `File already exists: ${finalPath}`
    return ""
  }

  const handleCreate = () => {
    const err = validate()
    if (err) { setError(err); return }
    const template = FILE_TEMPLATES[selectedType.ext] ?? (() => "")
    onCreateFile(finalPath, template(cleanName))
    toast.success(`Created ${finalPath}`)
    onClose()
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCreate()
    if (e.key === "Escape") onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[420px] bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-white text-lg font-semibold">Create Backend File</h2>
          <p className="text-xs text-muted-foreground mt-1">Add custom logic or configuration to your project.</p>
        </div>
        <div className="px-6 pb-4 grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs text-muted-foreground">Type</Label>
            <div className="col-span-3 flex gap-2">
              {FILE_TYPE_OPTIONS.map(opt => (
                <button key={opt.ext}
                  onClick={() => { setSelectedType(opt); setError(""); if (!useCustomFolder) setCustomFolder("") }}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg border text-xs transition-all ${
                    selectedType.ext === opt.ext
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-[#333] bg-[#222] hover:bg-[#2a2a2a] text-muted-foreground"
                  }`}>
                  {opt.icon}
                  <span className="text-[10px] uppercase font-bold">{opt.ext}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-xs text-muted-foreground">Name</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input
                ref={inputRef}
                value={fileName}
                onChange={e => { setFileName(e.target.value); setError("") }}
                onKeyDown={handleKey}
                placeholder="e.g. auth-logic"
                className="flex-1 font-mono h-9 bg-[#222] border-[#333] text-white text-sm"
              />
              <span className="text-xs text-muted-foreground font-mono shrink-0">.{selectedType.ext}</span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right flex flex-col items-end">
              <Label className="text-xs text-muted-foreground">Path</Label>
              <button onClick={() => { setUseCustomFolder(p => !p); setCustomFolder(selectedType.folder) }}
                className="text-[9px] text-blue-400 hover:underline">
                {useCustomFolder ? "Reset" : "Change"}
              </button>
            </div>
            <div className="col-span-3">
              <Input value={folder} onChange={e => setCustomFolder(e.target.value)} readOnly={!useCustomFolder}
                className={`font-mono h-9 text-sm ${!useCustomFolder ? "bg-[#111] border-[#222] text-muted-foreground" : "bg-[#222] border-[#333] text-white"}`} />
            </div>
          </div>
          {error && <p className="text-[10px] text-red-400 col-start-2 col-span-3">{error}</p>}
        </div>
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-[#222]/50 border-t border-[#333]">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-white">Cancel</Button>
          <Button size="sm" onClick={handleCreate} disabled={!cleanName} className="bg-blue-600 hover:bg-blue-700 text-white">Create File</Button>
        </div>
      </div>
    </div>
  )
}

// --- UTILITIES ---
function sanitizeId(id: string) { return id.replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase(); }

const buildTreeFromPaths = (paths: string[]): FileNode[] => {
  const root: FileNode = { name: "root", type: "folder", path: "", children: [] }
  for (const path of paths) {
    const segs = path.split("/")
    let cur = root
    segs.forEach((seg, i) => {
      const curPath = segs.slice(0, i + 1).join("/")
      const isFile  = i === segs.length - 1 && seg.includes(".")
      cur.children ??= []
      let node = cur.children.find(n => n.path === curPath)
      if (!node) {
        node = { name: seg, type: isFile ? "file" : "folder", path: curPath, children: isFile ? undefined : [] }
        cur.children.push(node)
      }
      cur = node
    })
  }
  const sort = (nodes: FileNode[]): FileNode[] =>
    nodes.sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === "folder" ? -1 : 1)
      .map(n => ({ ...n, children: n.children ? sort(n.children) : undefined }))
  return sort(root.children ?? [])
}

export function CodeViewEditor({ components, projectName = "php-builder", pages, activePageId, onCodeChange, onPageCreate }: CodeViewEditorProps) {
  const [selectedFile, setSelectedFile] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["app", "app/api", "public", "config"]))
  const [isEditing, setIsEditing] = useState(false)
  const [draftContent, setDraftContent] = useState("")
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [fileOverrides, setFileOverrides] = useState<FileOverrides>({})
  const [customFiles, setCustomFiles] = useState<FileOverrides>({})
  const [showFileCreator, setShowFileCreator] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const generatedFiles = useMemo(() => generateProjectFiles(components, pages, projectName), [components, pages, projectName])
  const effectiveFiles = useMemo<Record<string, string>>(() => ({ ...generatedFiles, ...fileOverrides, ...customFiles }), [generatedFiles, fileOverrides, customFiles])

  // Permissions logic
  const isViewPHP  = selectedFile.startsWith("app/views/") && selectedFile.endsWith(".php")
  const isCSSFile  = selectedFile.endsWith(".css")
  const isJSFile   = selectedFile.endsWith(".js")
  const isGeneratedFrontend = isViewPHP || isCSSFile || isJSFile;
  const canEdit = selectedFile && !isGeneratedFrontend;

  useEffect(() => {
    const page = pages.find(p => p.id === activePageId) ?? pages[0]
    setSelectedFile(prev => prev || `app/views/${slugify(page.name)}.php`)
  }, [activePageId, pages])

  const readOnlyContent = effectiveFiles[selectedFile] ?? ""
  const isCustomFile    = !!customFiles[selectedFile]
  const syntaxLang      = selectedFile.endsWith(".css") ? "css" : selectedFile.endsWith(".js") ? "javascript" : selectedFile.endsWith(".json") ? "json" : "php"

  const handleSelectFile = (path: string) => {
    if (path === selectedFile) return
    setIsEditing(false); setDraftContent(""); setSelectedFile(path)
  }

  const handleStartEdit = () => {
    if (!canEdit) { toast.error("This file is managed by the Canvas."); return; }
    setDraftContent(readOnlyContent); setIsEditing(true)
    setTimeout(() => textareaRef.current?.focus(), 0)
  }

  const handleSave = useCallback(() => {
    if (!selectedFile || !canEdit) return
    if (isCustomFile) setCustomFiles(prev => ({ ...prev, [selectedFile]: draftContent }))
    else setFileOverrides(prev => ({ ...prev, [selectedFile]: draftContent }))

    setIsEditing(false); setDraftContent(""); setSavedIndicator(true)
    setTimeout(() => setSavedIndicator(false), 2000)
    toast.success("Logic saved successfully.")
  }, [selectedFile, draftContent, canEdit, isCustomFile])

  const handleCreateFile = useCallback((path: string, content: string) => {
    setCustomFiles(prev => ({ ...prev, [path]: content }))
    setSelectedFile(path)
    const parts = path.split("/")
    setExpandedFolders(prev => {
      const next = new Set(prev)
      for (let i = 1; i < parts.length; i++) next.add(parts.slice(0, i).join("/"))
      return next
    })
  }, [])

  const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return
    e.preventDefault()
    const ta = e.currentTarget, start = ta.selectionStart, sp = "  "
    setDraftContent(ta.value.slice(0, start) + sp + ta.value.slice(ta.selectionEnd))
    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + sp.length })
  }

  const fileStructure = useMemo(() => buildTreeFromPaths(Object.keys(effectiveFiles)), [effectiveFiles])

  // Helper for recursive rendering
  const renderFileNode = (node: FileNode, depth = 0): React.ReactNode => (
    <div key={node.path}>
      <div onClick={() => node.type === "folder" 
          ? setExpandedFolders(p => { const n = new Set(p); n.has(node.path) ? n.delete(node.path) : n.add(node.path); return n }) 
          : handleSelectFile(node.path)}
        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-colors text-xs ${selectedFile === node.path ? "bg-blue-500/10 text-blue-400" : "text-muted-foreground hover:text-white hover:bg-[#222]"}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}>
        {node.type === "folder" 
          ? (expandedFolders.has(node.path) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) 
          : <File className="w-3 h-3 opacity-50" />
        }
        <span className="truncate">{node.name}</span>
      </div>
      {node.type === "folder" && expandedFolders.has(node.path) && node.children && (
        node.children.map(child => renderFileNode(child, depth + 1))
      )}
    </div>
  );

  const handleDownloadZip = useCallback(async () => {
    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()
      Object.entries(effectiveFiles).forEach(([filePath, content]) => { zip.file(filePath, content) })
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${projectName || "project"}.zip`
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success("Project zip downloaded")
    } catch (error) {
      toast.error("Failed to generate zip")
    }
  }, [effectiveFiles, projectName])

  return (
    <div className="w-full h-full flex gap-3 p-4 bg-[#0a0a0a]">
      {showFileCreator && <FileCreatorModal existingPaths={Object.keys(effectiveFiles)} onClose={() => setShowFileCreator(false)} onCreateFile={handleCreateFile} />}

      {/* Explorer */}
      <div className="w-56 border border-[#222] rounded-xl flex flex-col bg-[#111] overflow-hidden shrink-0">
        <div className="px-4 py-3 border-b border-[#222] flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filesystem</span>
          <button onClick={() => setShowFileCreator(true)} className="p-1 hover:bg-[#222] rounded text-muted-foreground hover:text-white">
            <FilePlus className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {fileStructure.map(node => renderFileNode(node, 0))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 border border-[#222] rounded-xl overflow-hidden flex flex-col bg-[#161616]">
        <div className="px-4 py-2 bg-[#111] border-b border-[#222] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[250px]">{selectedFile}</span>
            {isGeneratedFrontend && (
              <span className="text-[10px] flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                <Lock className="w-2.5 h-2.5" /> Read-Only
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                {canEdit && <Button size="sm" onClick={handleStartEdit} className="h-7 bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"><Pencil className="w-3 h-3" /> Edit Logic</Button>}
                {!canEdit && <Button size="sm" disabled className="h-7 bg-[#222] text-muted-foreground text-xs gap-1.5"><Eye className="w-3 h-3" /> View Only</Button>}
                <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(readOnlyContent); toast.success("Copied!") }} className="h-7 w-7 p-0 text-muted-foreground hover:text-white"><Copy className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="outline" className="h-7 text-xs border-[#333] text-muted-foreground hover:text-white" onClick={handleDownloadZip}><Download className="w-3 h-3" /></Button>
              </>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" onClick={handleSave} className="h-7 bg-green-600 hover:bg-green-700 text-white text-xs gap-1.5"><Save className="w-3.5 h-3.5" /> Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-7 text-muted-foreground hover:text-white text-xs"><X className="w-3.5 h-3.5" /> Cancel</Button>
              </div>
            )}
          </div>
        </div>

        {/* Informative Banner */}
        {isGeneratedFrontend && !isEditing && (
          <div className="px-4 py-2 bg-blue-500/5 border-b border-blue-500/10 flex items-center gap-2 text-[11px] text-blue-400/80">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Frontend managed by visual designer. Edit layout via the <strong>Canvas</strong> to prevent desync.</span>
          </div>
        )}

        <div className="flex-1 relative overflow-hidden">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={draftContent}
              onChange={e => setDraftContent(e.target.value)}
              onKeyDown={handleTabKey}
              spellCheck={false}
              className="absolute inset-0 w-full h-full resize-none bg-transparent text-[#d4d4d4] font-mono text-[13px] leading-relaxed p-6 outline-none"
            />
          ) : (
            <SyntaxHighlighter
              language={syntaxLang}
              style={customSyntaxTheme}
              showLineNumbers
              customStyle={{ margin: 0, padding: "24px", backgroundColor: "transparent", fontSize: "13px", lineHeight: "1.6", height: "100%" }}
            >
              {readOnlyContent || "// Select a file to view source"}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </div>
  )
}