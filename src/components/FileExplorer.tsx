import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  icon?: string;
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
}

export function FileExplorer({ onFileSelect, selectedFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['/css', '/js', '/php', '/database'])
  );
  const [localSelectedFile, setLocalSelectedFile] = useState<string>(selectedFile || '/index.html');

  const fileStructure: FileNode[] = [
    { name: 'index.html', type: 'file', path: '/index.html', icon: '🌐' },
    {
      name: 'css',
      type: 'folder',
      path: '/css',
      children: [
        { name: 'styles.css', type: 'file', path: '/css/styles.css' },
        { name: 'responsive.css', type: 'file', path: '/css/responsive.css' },
      ],
    },
    {
      name: 'js',
      type: 'folder',
      path: '/js',
      children: [
        { name: 'main.js', type: 'file', path: '/js/main.js' },
        { name: 'components.js', type: 'file', path: '/js/components.js' },
        { name: 'utils.js', type: 'file', path: '/js/utils.js' },
      ],
    },
    {
      name: 'php',
      type: 'folder',
      path: '/php',
      children: [
        { name: 'config.php', type: 'file', path: '/php/config.php' },
        { name: 'database.php', type: 'file', path: '/php/database.php' },
        { name: 'api.php', type: 'file', path: '/php/api.php' },
        { name: 'functions.php', type: 'file', path: '/php/functions.php' },
      ],
    },
    {
      name: 'database',
      type: 'folder',
      path: '/database',
      children: [
        { name: 'schema.sql', type: 'file', path: '/database/schema.sql' },
        { name: 'migrations.sql', type: 'file', path: '/database/migrations.sql' },
        { name: 'seeders.sql', type: 'file', path: '/database/seeders.sql' },
      ],
    },
    {
      name: 'assets',
      type: 'folder',
      path: '/assets',
      children: [
        { name: 'images', type: 'folder', path: '/assets/images', children: [] },
        { name: 'fonts', type: 'folder', path: '/assets/fonts', children: [] },
      ],
    },
  ];

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const renderFileNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = localSelectedFile === node.path;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <div
            className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent transition-colors text-foreground file-explorer-item"
            style={{ paddingLeft: `${8 + depth * 16}px` }}
            onClick={() => toggleFolder(node.path)}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 text-primary flex-shrink-0" />
            ) : (
              <Folder className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <span className="text-sm truncate">{node.name}</span>
          </div>
          {isExpanded && node.children && (
            <div>{node.children.map((child) => renderFileNode(child, depth + 1))}</div>
          )}
        </div>
      );
    }

    return (
      <div
        key={node.path}
        className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent transition-colors file-explorer-item ${
          isSelected ? 'bg-primary/10 text-primary border-l-2 border-primary selected' : 'text-foreground'
        }`}
        style={{ paddingLeft: `${32 + depth * 16}px` }}
        onClick={() => {
          setLocalSelectedFile(node.path);
          onFileSelect(node);
        }}
      >
        <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm truncate">{node.name}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card text-card-foreground border-r border-border">
      <div className="px-3 py-2 border-b border-border bg-muted/30">
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Explorer</h3>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-1">
          {fileStructure.map((node) => renderFileNode(node))}
        </div>
      </ScrollArea>
    </div>
  );
}
