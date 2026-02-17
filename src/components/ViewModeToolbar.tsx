import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Eye, Split, Code2, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ViewModeToolbarProps {
  viewMode: 'design' | 'split' | 'code';
  onViewModeChange: (mode: 'design' | 'split' | 'code') => void;
  isCodeSyncing: boolean;
  onToggleCodeSync: () => void;
  componentsCount: number;
}

export function ViewModeToolbar({
  viewMode,
  onViewModeChange,
  isCodeSyncing,
  onToggleCodeSync,
  componentsCount
}: ViewModeToolbarProps) {
  const copyCode = async () => {
    try {
      const codeContent = document.querySelector('.code-editor-content')?.textContent || '';
      await navigator.clipboard.writeText(codeContent);
      toast.success('Code copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3 border-b bg-card flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === 'design' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('design')}
            title="Design View"
            className="h-9 w-9 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'split' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('split')}
            title="Split View"
            className="h-9 w-9 p-0"
          >
            <Split className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'code' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('code')}
            title="Code View"
            className="h-9 w-9 p-0"
          >
            <Code2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <h3 className="font-medium">
            {viewMode === 'design' && 'Visual Designer'}
            {viewMode === 'split' && 'Split View'}
            {viewMode === 'code' && 'Code Editor'}
          </h3>
          <Badge variant="outline" className="text-xs">
            {componentsCount} component{componentsCount !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={isCodeSyncing ? 'default' : 'secondary'} className="text-xs">
          {isCodeSyncing ? 'Live Sync' : 'Manual'}
        </Badge>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleCodeSync}
          title={isCodeSyncing ? 'Disable Auto Sync' : 'Enable Auto Sync'}
          className="h-9 w-9 p-0"
        >
          <RefreshCw className={`w-4 h-4 ${isCodeSyncing ? 'animate-spin' : ''}`} />
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyCode}
          title="Copy Code"
          className="h-9 w-9 p-0"
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
