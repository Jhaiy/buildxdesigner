import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export function ThemeSettingsModal({ 
  isOpen, 
  onClose, 
  currentTheme,
  onThemeChange 
}: ThemeSettingsModalProps) {
  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    onThemeChange(theme);
    // Auto-close after selection (optional)
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Theme Settings</DialogTitle>
          <DialogDescription>
            Choose your preferred color theme for CodeCraft
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <RadioGroup value={currentTheme} onValueChange={handleThemeSelect}>
            <div className="space-y-3">
              {/* Light Theme */}
              <div
                onClick={() => handleThemeSelect('light')}
                className={`relative flex items-center space-x-4 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                  currentTheme === 'light'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <RadioGroupItem value="light" id="light" className="mt-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <Label htmlFor="light" className="text-base font-medium cursor-pointer">
                        Light
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Bright and clean interface
                      </p>
                    </div>
                  </div>
                </div>
                {currentTheme === 'light' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </div>

              {/* Dark Theme */}
              <div
                onClick={() => handleThemeSelect('dark')}
                className={`relative flex items-center space-x-4 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                  currentTheme === 'dark'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <RadioGroupItem value="dark" id="dark" className="mt-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <Label htmlFor="dark" className="text-base font-medium cursor-pointer">
                        Dark
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Easy on the eyes, perfect for focus
                      </p>
                    </div>
                  </div>
                </div>
                {currentTheme === 'dark' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </div>

              {/* System Theme */}
              <div
                onClick={() => handleThemeSelect('system')}
                className={`relative flex items-center space-x-4 rounded-lg border-2 p-4 cursor-pointer transition-all hover:bg-accent/50 ${
                  currentTheme === 'system'
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                }`}
              >
                <RadioGroupItem value="system" id="system" className="mt-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-200 to-violet-300 dark:from-violet-700 dark:to-violet-900 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-violet-700 dark:text-violet-300" />
                    </div>
                    <div>
                      <Label htmlFor="system" className="text-base font-medium cursor-pointer">
                        System
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Sync with your OS theme
                      </p>
                    </div>
                  </div>
                </div>
                {currentTheme === 'system' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
            <div className="mt-0.5">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Theme Preview</p>
              Your theme preference will be saved and applied across all CodeCraft sessions.
              System theme automatically switches between light and dark based on your OS settings.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
