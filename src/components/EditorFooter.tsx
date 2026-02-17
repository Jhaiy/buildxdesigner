import React from 'react';
import { Badge } from './ui/badge';
import { Code2, Zap, Clock, CheckCircle2, ZoomIn } from 'lucide-react';

interface EditorFooterProps {
  componentsCount: number;
  editorMode: 'blocks' | 'dual-pane';
  lastSaved: Date | null;
  canvasZoom?: number;
}

export function EditorFooter({ componentsCount, editorMode, lastSaved, canvasZoom = 100 }: EditorFooterProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border-t bg-card px-4 py-2 flex items-center justify-between text-xs text-muted-foreground flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" />
          <span>BuildX Designer v1.0.0</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-blue-500" />
          <span className="capitalize">{editorMode} Mode</span>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span>{componentsCount} Component{componentsCount !== 1 ? 's' : ''}</span>
        </div>

        <div className="flex items-center gap-2">
          <ZoomIn className="w-3.5 h-3.5 text-purple-500" />
          <span>{canvasZoom}% Zoom</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {lastSaved && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Last saved: {formatTime(lastSaved)}</span>
          </div>
        )}
        
        <Badge variant="secondary" className="text-xs">
          Ready
        </Badge>
      </div>
    </div>
  );
}
