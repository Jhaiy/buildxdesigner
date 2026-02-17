import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Folder, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectName: string) => void;
  isLoading?: boolean;
}

export function CreateProjectModal({ 
  isOpen, 
  onClose, 
  onCreateProject, 
  isLoading = false 
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }
    
    if (projectName.trim().length < 3) {
      setError('Project name must be at least 3 characters long');
      return;
    }
    
    setError('');
    onCreateProject(projectName.trim());
  };

  const handleClose = () => {
    if (!isLoading) {
      setProjectName('');
      setError('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden"
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Create New Project</h2>
                    <p className="text-sm text-blue-100">Enter a name for your project</p>
                  </div>
                </div>
                {!isLoading && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="projectName" className="text-gray-700 font-medium">
                  Project Name
                </Label>
                <Input
                  id="projectName"
                  type="text"
                  placeholder="My Awesome Website"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (error) setError('');
                  }}
                  className={`${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'} transition-colors`}
                  disabled={isLoading}
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !projectName.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </div>
            </form>

            {/* Loading overlay */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="loading-spinner mx-auto mb-3"></div>
                  <p className="text-gray-600 font-medium">Creating your project...</p>
                  <p className="text-sm text-gray-500">This will just take a moment</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
