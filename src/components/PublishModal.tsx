import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Globe, CheckCircle, AlertCircle, Copy, ExternalLink, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { ComponentData } from '../App';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: ComponentData[];
}

interface PublishSettings {
  siteName: string;
  customDomain: string;
  isPublic: boolean;
  enableAnalytics: boolean;
  enableComments: boolean;
  seoTitle: string;
  seoDescription: string;
  category: string;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  components
}) => {
  const [publishStep, setPublishStep] = useState<'configure' | 'publishing' | 'success'>('configure');
  const [publishSettings, setPublishSettings] = useState<PublishSettings>({
    siteName: '',
    customDomain: '',
    isPublic: true,
    enableAnalytics: false,
    enableComments: false,
    seoTitle: '',
    seoDescription: '',
    category: 'portfolio'
  });
  const [publishedUrl, setPublishedUrl] = useState('');
  const [publishProgress, setPublishProgress] = useState(0);

  const handlePublish = async () => {
    setPublishStep('publishing');
    setPublishProgress(0);

    // Simulate publishing process
    const steps = [
      { message: 'Optimizing components...', duration: 1000 },
      { message: 'Generating code...', duration: 1500 },
      { message: 'Deploying to server...', duration: 2000 },
      { message: 'Setting up domain...', duration: 1000 },
      { message: 'Finalizing deployment...', duration: 500 }
    ];

    let currentProgress = 0;
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.duration));
      currentProgress += 100 / steps.length;
      setPublishProgress(Math.round(currentProgress));
    }

    // Generate mock URL
    const domain = publishSettings.customDomain || 
      `${publishSettings.siteName.toLowerCase().replace(/\s+/g, '-')}.fulldevai.app`;
    setPublishedUrl(`https://${domain}`);
    setPublishStep('success');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(publishedUrl);
  };

  const handleInputChange = (field: keyof PublishSettings) => (
    value: string | boolean
  ) => {
    setPublishSettings(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="relative text-center pb-4">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Upload className="w-8 h-8 text-white" />
              </div>
              
              <CardTitle className="text-2xl font-bold mb-2">
                {publishStep === 'configure' && 'Publish Your Website'}
                {publishStep === 'publishing' && 'Publishing...'}
                {publishStep === 'success' && 'Successfully Published!'}
              </CardTitle>
              
              <p className="text-muted-foreground text-sm">
                {publishStep === 'configure' && 'Configure your website settings and make it live'}
                {publishStep === 'publishing' && 'Please wait while we deploy your website'}
                {publishStep === 'success' && 'Your website is now live and accessible to everyone'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {publishStep === 'configure' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Basic Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Basic Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name *</Label>
                        <Input
                          id="siteName"
                          placeholder="My Awesome Website"
                          value={publishSettings.siteName}
                          onChange={(e) => handleInputChange('siteName')(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                        <Input
                          id="customDomain"
                          placeholder="mysite.com"
                          value={publishSettings.customDomain}
                          onChange={(e) => handleInputChange('customDomain')(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={publishSettings.category}
                        onValueChange={(value) => handleInputChange('category')(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="portfolio">Portfolio</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="blog">Blog</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="landing">Landing Page</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* SEO Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">SEO & Meta Data</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        placeholder="Amazing Website - Built with FullDev AI"
                        value={publishSettings.seoTitle}
                        onChange={(e) => handleInputChange('seoTitle')(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">Meta Description</Label>
                      <Textarea
                        id="seoDescription"
                        placeholder="A beautiful website created with FullDev AI's drag-and-drop builder..."
                        value={publishSettings.seoDescription}
                        onChange={(e) => handleInputChange('seoDescription')(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Privacy & Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Privacy & Features</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Public Website</Label>
                          <p className="text-sm text-muted-foreground">Make your website discoverable by search engines</p>
                        </div>
                        <Switch
                          checked={publishSettings.isPublic}
                          onCheckedChange={(checked) => handleInputChange('isPublic')(checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Analytics</Label>
                          <p className="text-sm text-muted-foreground">Track visitor data and site performance</p>
                        </div>
                        <Switch
                          checked={publishSettings.enableAnalytics}
                          onCheckedChange={(checked) => handleInputChange('enableAnalytics')(checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Enable Comments</Label>
                          <p className="text-sm text-muted-foreground">Allow visitors to leave comments</p>
                        </div>
                        <Switch
                          checked={publishSettings.enableComments}
                          onCheckedChange={(checked) => handleInputChange('enableComments')(checked)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview URL */}
                  {publishSettings.siteName && (
                    <div className="p-4 bg-muted rounded-lg">
                      <Label className="text-sm font-medium">Your website will be available at:</Label>
                      <div className="mt-2 p-2 bg-background border rounded font-mono text-sm">
                        https://{publishSettings.customDomain || 
                          `${publishSettings.siteName.toLowerCase().replace(/\s+/g, '-')}.fulldevai.app`}
                      </div>
                    </div>
                  )}

                  {/* Publish Button */}
                  <Button
                    onClick={handlePublish}
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={!publishSettings.siteName.trim()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Publish Website
                  </Button>
                </motion.div>
              )}

              {publishStep === 'publishing' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-24 h-24 mx-auto relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-full h-full border-4 border-green-200 border-t-green-600 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-600">{publishProgress}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Deploying Your Website</h3>
                    <p className="text-muted-foreground">
                      We're optimizing your components and deploying them to our global CDN...
                    </p>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className="h-2 bg-green-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${publishProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}

              {publishStep === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">🎉 Website Published Successfully!</h3>
                    <p className="text-muted-foreground">
                      Your website is now live and accessible to everyone
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-green-800">Live URL:</Label>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Globe className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-2 bg-white border rounded font-mono text-sm text-green-700">
                        {publishedUrl}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyUrl}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(publishedUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                    <Button
                      onClick={onClose}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Done
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
