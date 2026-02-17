import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Settings, 
  ExternalLink, 
  Key, 
  Info, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface GeminiConfigCardProps {
  onDismiss?: () => void;
}

export function GeminiConfigCard({ onDismiss }: GeminiConfigCardProps) {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Settings className="w-5 h-5" />
          Configure Gemini AI
          <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
            Optional
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            The AI generator currently uses intelligent fallback generation. Connect to Google's Gemini API for enhanced AI capabilities.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-700">1</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Get Gemini API Key</p>
              <p className="text-xs text-muted-foreground">
                Visit Google AI Studio to create your API key
              </p>
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
              >
                Get API Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-700">2</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Update Configuration</p>
              <p className="text-xs text-muted-foreground">
                Replace <code className="bg-gray-100 px-1 rounded">YOUR_GEMINI_API_KEY_HERE</code> in AIDesignGenerator.tsx
              </p>
              <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono">
                const apiKey = 'your-actual-api-key-here';
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-700">3</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Enable API Calls</p>
              <p className="text-xs text-muted-foreground">
                Uncomment the fetch code and comment out the mock generation
              </p>
            </div>
          </div>
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Security Note:</strong> In production, API keys should be stored securely on your backend, not in frontend code.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">Intelligent fallback active</span>
          </div>
          {onDismiss && (
            <button 
              onClick={onDismiss}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
