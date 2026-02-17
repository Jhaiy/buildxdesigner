import React from 'react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { 
  Eye, 
  Code, 
  Trash2, 
  Save,
  Palette,
  ArrowLeft,
  Share2,
  Upload
} from 'lucide-react';
import { SaveIndicator } from './SaveIndicator';
import { ExitConfirmationModal } from './ExitConfirmationModal';

interface ToolbarProps {
  onPreview: () => void;
  onExport: () => void;
  onPublish: () => void;
  onShare: () => void;
  onGoToDashboard?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  hasUnsavedChanges?: boolean;
}

export function Toolbar({ 
  onPreview, 
  onExport, 
  onPublish,
  onShare,
  onGoToDashboard,
  onSave,
  isSaving = false,
  lastSaved = null,
  hasUnsavedChanges = false
}: ToolbarProps) {
  const [showExitConfirmation, setShowExitConfirmation] = React.useState(false);

  return (
    <div className="border-b bg-card p-2 md:p-4 flex items-center justify-between overflow-x-auto">
      <div className="flex items-center gap-1 md:gap-2 min-w-0">
        <div className="flex items-center gap-2 mr-2 md:mr-6 flex-shrink-0">
          {onGoToDashboard && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => setShowExitConfirmation(true)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Back to Dashboard
              </TooltipContent>
            </Tooltip>
          )}
          <Palette className="w-5 h-5 md:w-6 md:h-6 text-primary" />
          <h1 className="text-lg md:text-xl font-bold whitespace-nowrap">FullDev AI</h1>
        </div>
        
        {/* Save Indicator */}
        <div className="hidden md:block ml-4">
          <SaveIndicator 
            isSaving={isSaving}
            lastSaved={lastSaved}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        {onSave && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={onSave}
                disabled={!hasUnsavedChanges || isSaving}
              >
                <Save className={`w-4 h-4 mr-2 ${isSaving ? 'animate-pulse' : ''}`} />
                <span className="hidden lg:inline">
                  {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Save Project <kbd>Ctrl+S</kbd>
            </TooltipContent>
          </Tooltip>
        )}
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-0 md:mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Preview <kbd>Ctrl+P</kbd>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onExport}>
              <Code className="w-4 h-4 mr-0 md:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Export Code
          </TooltipContent>
        </Tooltip>

        {/* Publish Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="default" size="sm" onClick={onPublish} className="bg-green-600 hover:bg-green-700">
              <Upload className="w-4 h-4 mr-0 md:mr-2" />
              <span className="hidden sm:inline">Publish</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Publish Website
          </TooltipContent>
        </Tooltip>

        {/* Share Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4 mr-0 md:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Share Project
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Exit Confirmation Modal */}
      <ExitConfirmationModal
        isOpen={showExitConfirmation}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={() => {
          setShowExitConfirmation(false);
          if (onGoToDashboard) {
            onGoToDashboard();
          }
        }}
      />
    </div>
  );
}
