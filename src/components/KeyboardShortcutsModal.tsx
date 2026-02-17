import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  category: string;
  shortcuts: {
    action: string;
    keys: string[];
    description?: string;
  }[];
}

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const shortcuts: Shortcut[] = [
    {
      category: 'General',
      shortcuts: [
        { action: 'Save Project', keys: ['Ctrl', 'S'], description: 'Save your current work' },
        { action: 'New Project', keys: ['Ctrl', 'N'], description: 'Create a new project' },
        { action: 'Open Templates', keys: ['Ctrl', 'O'], description: 'Browse template library' },
        { action: 'Preview', keys: ['Ctrl', 'P'], description: 'Preview your website' },
        { action: 'Fullscreen', keys: ['F11'], description: 'Toggle fullscreen mode' },
        { action: 'Undo', keys: ['Ctrl', 'Z'], description: 'Undo last action' },
        { action: 'Redo', keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo last undone action' },
      ],
    },
    {
      category: 'View',
      shortcuts: [
        { action: 'Toggle Left Sidebar', keys: ['Ctrl', 'B'], description: 'Show/hide component palette' },
        { action: 'Toggle Right Sidebar', keys: ['Ctrl', 'Shift', 'R'], description: 'Show/hide properties panel' },
        { action: 'Toggle Properties Panel', keys: ['Ctrl', 'Shift', 'P'], description: 'Show/hide properties' },
        { action: 'Toggle AI Assistant', keys: ['Ctrl', 'Shift', 'A'], description: 'Show/hide AI assistant' },
        { action: 'Toggle Split View', keys: ['Ctrl', '\\'], description: 'Enable split design/code view' },
        { action: 'Switch to Design View', keys: ['Ctrl', '1'], description: 'Show only design canvas' },
        { action: 'Switch to Code View', keys: ['Ctrl', '2'], description: 'Show only code editor' },
      ],
    },
    {
      category: 'Canvas',
      shortcuts: [
        { action: 'Zoom In', keys: ['Ctrl', '+'], description: 'Increase canvas zoom' },
        { action: 'Zoom Out', keys: ['Ctrl', '-'], description: 'Decrease canvas zoom' },
        { action: 'Reset Zoom', keys: ['Ctrl', '0'], description: 'Reset zoom to 100%' },
        { action: 'Delete Component', keys: ['Delete'], description: 'Remove selected component' },
        { action: 'Deselect', keys: ['Esc'], description: 'Clear component selection' },
      ],
    },
    {
      category: 'Code Editor',
      shortcuts: [
        { action: 'Toggle Editor Mode', keys: ['Ctrl', 'E'], description: 'Switch between blocks and dual-pane' },
        { action: 'Find', keys: ['Ctrl', 'F'], description: 'Search in code' },
        { action: 'Replace', keys: ['Ctrl', 'H'], description: 'Find and replace' },
        { action: 'Comment Line', keys: ['Ctrl', '/'], description: 'Toggle line comment' },
        { action: 'Indent', keys: ['Tab'], description: 'Indent selected lines' },
        { action: 'Outdent', keys: ['Shift', 'Tab'], description: 'Remove indentation' },
      ],
    },
    {
      category: 'Components',
      shortcuts: [
        { action: 'Copy Component', keys: ['Ctrl', 'C'], description: 'Copy selected component' },
        { action: 'Paste Component', keys: ['Ctrl', 'V'], description: 'Paste copied component' },
        { action: 'Duplicate Component', keys: ['Ctrl', 'D'], description: 'Duplicate selected component' },
        { action: 'Select All', keys: ['Ctrl', 'A'], description: 'Select all components' },
      ],
    },
    {
      category: 'Navigation',
      shortcuts: [
        { action: 'Go to Dashboard', keys: ['Ctrl', 'Shift', 'D'], description: 'Return to dashboard' },
        { action: 'Open Settings', keys: ['Ctrl', ','], description: 'Open preferences' },
        { action: 'Toggle Command Palette', keys: ['Ctrl', 'K'], description: 'Open quick command menu' },
      ],
    },
  ];

  const filteredShortcuts = shortcuts.map(category => ({
    ...category,
    shortcuts: category.shortcuts.filter(shortcut =>
      shortcut.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.keys.some(key => key.toLowerCase().includes(searchQuery.toLowerCase())) ||
      shortcut.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.shortcuts.length > 0);

  const renderKey = (key: string) => (
    <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded shadow-sm">
      {key}
    </kbd>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Master CodeCraft with these keyboard shortcuts
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search shortcuts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Shortcuts List */}
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6 py-4">
            {filteredShortcuts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No shortcuts found matching "{searchQuery}"
              </div>
            ) : (
              filteredShortcuts.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold">{category.category}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.shortcuts.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {category.shortcuts.map((shortcut, shortcutIndex) => (
                      <div
                        key={shortcutIndex}
                        className="flex items-start justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{shortcut.action}</div>
                          {shortcut.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {shortcut.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          {shortcut.keys.map((key, keyIndex) => (
                            <React.Fragment key={keyIndex}>
                              {keyIndex > 0 && (
                                <span className="text-muted-foreground mx-0.5">+</span>
                              )}
                              {renderKey(key)}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded">Ctrl</kbd> on Windows/Linux, 
            <kbd className="px-1.5 py-0.5 text-xs bg-muted border border-border rounded ml-1">Cmd</kbd> on Mac
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
