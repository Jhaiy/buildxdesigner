import React from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { 
  File,
  Save,
  FolderOpen,
  Eye,
  Layout,
  Minus,
  Plus,
  RotateCcw,
  Split,
  Blocks,
  PanelLeftClose,
  PanelLeft,
  Menu,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface MainMenuProps {
  onNew: () => void;
  onSave: () => void;
  onOpen: () => void;
  onPreview: () => void;
  onToggleEditor: () => void;
  onToggleSidebar: () => void;
  onSetCanvasZoom: (zoom: number) => void;
  editorMode: 'blocks' | 'dual-pane';
  sidebarVisible: boolean;
  canvasZoom: number;
}

export function MainMenu({ 
  onNew,
  onSave,
  onOpen,
  onPreview,
  onToggleEditor,
  onToggleSidebar,
  onSetCanvasZoom,
  editorMode,
  sidebarVisible,
  canvasZoom
}: MainMenuProps) {
  return (
    <div className="bg-background border-b border-border h-10 flex items-center px-2 text-sm">
      {/* File Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={onNew}>
            <File className="w-4 h-4 mr-2" />
            New Project
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onOpen}>
            <FolderOpen className="w-4 h-4 mr-2" />
            Open
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+O</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={onToggleSidebar}>
            {sidebarVisible ? <PanelLeftClose className="w-4 h-4 mr-2" /> : <PanelLeft className="w-4 h-4 mr-2" />}
            {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+B</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleEditor}>
            {editorMode === 'blocks' ? <Split className="w-4 h-4 mr-2" /> : <Blocks className="w-4 h-4 mr-2" />}
            {editorMode === 'blocks' ? 'Split View' : 'Blocks Only'}
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+E</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onPreview}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+P</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Zoom Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
            Zoom
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem onClick={() => onSetCanvasZoom(canvasZoom + 10)} disabled={canvasZoom >= 200}>
            <Plus className="w-4 h-4 mr-2" />
            Zoom In
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+=</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSetCanvasZoom(canvasZoom - 10)} disabled={canvasZoom <= 50}>
            <Minus className="w-4 h-4 mr-2" />
            Zoom Out
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+-</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onSetCanvasZoom(100)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Zoom
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+0</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <span className="text-xs text-muted-foreground">Current: {canvasZoom}%</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tools Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
            Tools
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem>
            <Layout className="w-4 h-4 mr-2" />
            Component Library
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Menu className="w-4 h-4 mr-2" />
            Project Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Help Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-3 text-sm">
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem>
            Keyboard Shortcuts
          </DropdownMenuItem>
          <DropdownMenuItem>
            Documentation
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            About FullDev AI
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
