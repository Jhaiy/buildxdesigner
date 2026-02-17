import React, { useEffect, useState } from 'react';
import { Check, Cloud, CloudOff, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export function SaveIndicator({ isSaving, lastSaved, hasUnsavedChanges }: SaveIndicatorProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isSaving && lastSaved && !hasUnsavedChanges) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved, hasUnsavedChanges]);

  const getTimeAgo = (date: Date | null) => {
    if (!date) return '';
    
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2 px-2">
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
            <span className="text-xs text-gray-400">Saving...</span>
          </motion.div>
        ) : showSuccess ? (
          <motion.div
            key="saved"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Check className="w-3 h-3 text-green-500" />
            <span className="text-xs text-gray-400">Saved</span>
          </motion.div>
        ) : hasUnsavedChanges ? (
          <motion.div
            key="unsaved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-400">Unsaved</span>
          </motion.div>
        ) : (
          <motion.div
            key="synced"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Cloud className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-400">
              {lastSaved ? getTimeAgo(lastSaved) : 'Saved'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
