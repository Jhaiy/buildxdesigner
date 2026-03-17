import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Eye, Code, Save, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CustomComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, html: string, css: string) => Promise<void>;
  onUpdate?: (id: string, name: string, description: string, html: string, css: string) => Promise<void>;
  projectId: string;
  initialData?: {
    id: string;
    name: string;
    description: string;
    html: string;
    css: string;
  } | null;
}

export function CustomComponentModal({ isOpen, onClose, onSave, onUpdate, projectId, initialData }: CustomComponentModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [htmlCode, setHtmlCode] = useState('<div class="p-8 bg-blue-500 text-white rounded-lg shadow-xl">\n  <h2 class="text-2xl font-bold">Hello World</h2>\n  <p class="mt-2">This is my custom component.</p>\n</div>');
  const [cssCode, setCssCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Debounced preview state
  const [debouncedPreviewContent, setDebouncedPreviewContent] = useState('');
  const [isPreviewUpdating, setIsPreviewUpdating] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setHtmlCode(initialData.html);
      setCssCode(initialData.css);
    } else if (isOpen && !initialData) {
      setName('');
      setDescription('');
      setHtmlCode('<div class="p-8 bg-blue-500 text-white rounded-lg shadow-xl">\n  <h2 class="text-2xl font-bold">Hello World</h2>\n  <p class="mt-2">This is my custom component.</p>\n</div>');
      setCssCode('');
    }
  }, [isOpen, initialData]);

  // Debounced preview effect
  useEffect(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Show that preview is updating
    setIsPreviewUpdating(true);

    // Set new timeout to update preview after delay
    debounceTimeoutRef.current = setTimeout(() => {
      const content = `
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                margin: 0; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh;
                background: transparent;
              }
              ${cssCode}
            </style>
          </head>
          <body>
            <div style="width: 100%; display: flex; justify-content: center;">
              ${htmlCode}
            </div>
          </body>
        </html>
      `;
      setDebouncedPreviewContent(content);
      setIsPreviewUpdating(false);
    }, 500); // 500ms delay

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [htmlCode, cssCode]);

  // Set initial preview content when modal opens
  useEffect(() => {
    if (isOpen) {
      const content = `
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                margin: 0; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                min-height: 100vh;
                background: transparent;
              }
              ${cssCode}
            </style>
          </head>
          <body>
            <div style="width: 100%; display: flex; justify-content: center;">
              ${htmlCode}
            </div>
          </body>
        </html>
      `;
      setDebouncedPreviewContent(content);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Please enter a component name');
      return;
    }
    
    setIsSaving(true);
    try {
      if (initialData && onUpdate) {
        await onUpdate(initialData.id, name, description, htmlCode, cssCode);
        toast.success('Component updated successfully');
      } else {
        await onSave(name, description, htmlCode, cssCode);
        toast.success('Component saved successfully');
      }
      onClose();
    } catch (error) {
      toast.error(initialData ? 'Failed to update component' : 'Failed to save component');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a component name');
      return;
    }
    
    setIsSaving(true);
    try {
      // Use " (Copy)" suffix for the name as requested
      const duplicatedName = `${name} (Copy)`;
      await onSave(duplicatedName, description, htmlCode, cssCode);
      toast.success('Component duplicated successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to duplicate component');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[90vw] h-[85vh] sm:max-w-[90vw] flex flex-col p-0 overflow-hidden bg-background border border-border shadow-2xl rounded-xl">
        <DialogHeader className="p-4 border-b shrink-0 bg-muted/30">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold">{initialData ? 'Edit Custom Component' : 'Create Custom Component'}</DialogTitle>
            <DialogDescription className="text-xs">Design your own component.</DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-2 overflow-hidden">
          {/* Left Side: Editor */}
          <div className="flex flex-col border-r bg-background overflow-hidden">
            <div className="p-4 border-b bg-muted/10 flex gap-4 shrink-0">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase text-muted-foreground ml-1 font-mono">Component Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Hero Section" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-sm bg-background border-muted-foreground/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="description" className="text-[10px] font-bold uppercase text-muted-foreground ml-1 font-mono">Description (Optional)</Label>
                <Input 
                  id="description" 
                  placeholder="What does this component do?" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-8 text-sm bg-background border-muted-foreground/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <Tabs defaultValue="html" className="flex-1 flex flex-col min-h-0">
              <div className="px-4 border-b shrink-0 bg-muted/5">
                <TabsList className="bg-transparent h-10 p-0 gap-8">
                  <TabsTrigger 
                    value="html" 
                    className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary border-0 border-b-2 border-transparent rounded-none px-0 h-10 text-xs font-bold uppercase tracking-tight focus-visible:ring-0"
                  >
                    <Code className="w-3.5 h-3.5 mr-2" /> HTML
                  </TabsTrigger>
                  <TabsTrigger 
                    value="css" 
                    className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary border-0 border-b-2 border-transparent rounded-none px-0 h-10 text-xs font-bold uppercase tracking-tight focus-visible:ring-0"
                  >
                    <Code className="w-3.5 h-3.5 mr-2" /> Vanilla CSS
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="html" className="flex-1 mt-0 relative min-h-0 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  theme="vs-dark"
                  value={htmlCode}
                  onChange={(value) => setHtmlCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    lineNumbers: 'on',
                    padding: { top: 10 }
                  }}
                />
              </TabsContent>
              <TabsContent value="css" className="flex-1 mt-0 relative min-h-0 overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="css"
                  theme="vs-dark"
                  value={cssCode}
                  onChange={(value) => setCssCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    lineNumbers: 'on',
                    padding: { top: 10 }
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side: Preview */}
          <div className="flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
            <div className="px-4 py-2 border-b bg-muted/40 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
                {isPreviewUpdating && (
                  <div className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    <span className="text-[8px] text-muted-foreground">Updating...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
              <iframe
                title="component-preview"
                srcDoc={debouncedPreviewContent}
                className="w-full h-full border-none flex-1"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-muted/30 shrink-0 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          
          {initialData && (
            <Button 
              variant="secondary" 
              onClick={handleDuplicate} 
              disabled={isSaving}
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              {isSaving ? 'Duplicating...' : 'Duplicate'}
            </Button>
          )}

          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : initialData ? 'Update Component' : 'Save Component'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
