import React from 'react';
import { Check, Cloud, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export function MobileSaveIndicator({ isSaving, lastSaved, hasUnsavedChanges }: MobileSaveIndicatorProps) {
  // Only show when there's activity (saving or unsaved changes)
  const shouldShow = isSaving || hasUnsavedChanges;

  const getTimeAgo = (date: Date | null) => {
    if (!date) return '';
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    return 'Saved';
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="md:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40"
        >
          <div className="bg-card border rounded-full shadow-lg px-4 py-2 flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-primary font-medium">Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-orange-500"
                />
                <span className="text-sm text-orange-600 dark:text-orange-400">Unsaved</span>
              </>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
