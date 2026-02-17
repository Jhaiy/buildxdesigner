import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { Button } from './ui/button';

export function ResizeTooltip() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already seen the tooltip
    const hasSeenTooltip = localStorage.getItem('codecraft-resize-tooltip-seen');
    
    if (!hasSeenTooltip) {
      // Show tooltip after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('codecraft-resize-tooltip-seen', 'true');
  };

  const handleGotIt = () => {
    handleDismiss();
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-500">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-2xl p-4 border-2 border-primary-foreground/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold mb-1 text-sm">💡 Move & Resize Components</h3>
            <p className="text-xs mb-3 leading-relaxed opacity-90">
              <strong>Drag</strong> components to move them anywhere. <strong>Hover</strong> to see resize handles on edges and corners!
            </p>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleGotIt}
                className="text-xs h-7 px-3"
              >
                Got it!
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="text-xs h-7 px-2 hover:bg-primary-foreground/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
