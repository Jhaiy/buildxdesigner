import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Save, Globe, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AdminGeneralSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GeneralSettings {
  siteName: string;
  siteUrl: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  requireEmailVerification: boolean;
  maxProjectsPerUser: number;
  sessionTimeout: number;
  enableAnalytics: boolean;
}

export function AdminGeneralSettings({ open, onOpenChange }: AdminGeneralSettingsProps) {
  const [settings, setSettings] = useState<GeneralSettings>({
    siteName: 'CodeCraft',
    siteUrl: 'https://codecraft.com',
    siteDescription: 'A drag-and-drop website builder that generates clean, exportable code',
    contactEmail: 'support@codecraft.com',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    maxProjectsPerUser: 10,
    sessionTimeout: 30,
    enableAnalytics: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('codecraft-admin-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      localStorage.setItem('codecraft-admin-settings', JSON.stringify(settings));
      setIsSaving(false);
      toast.success('Settings saved successfully');
      onOpenChange(false);
    }, 800);
  };

  const handleReset = () => {
    const defaultSettings: GeneralSettings = {
      siteName: 'CodeCraft',
      siteUrl: 'https://codecraft.com',
      siteDescription: 'A drag-and-drop website builder that generates clean, exportable code',
      contactEmail: 'support@codecraft.com',
      maintenanceMode: false,
      allowRegistrations: true,
      requireEmailVerification: true,
      maxProjectsPerUser: 10,
      sessionTimeout: 30,
      enableAnalytics: true,
    };
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            General Settings
          </DialogTitle>
          <DialogDescription>
            Configure site-wide settings and system preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Site Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Site Information</CardTitle>
              <CardDescription>Basic information about your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="CodeCraft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  placeholder="https://codecraft.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  placeholder="Describe your site..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="support@codecraft.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                System Settings
              </CardTitle>
              <CardDescription>Control system behavior and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Temporarily disable access to the site</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, maintenanceMode: checked })
                  }
                />
              </div>

              {settings.maintenanceMode && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-900">
                      Maintenance mode is enabled. Users will not be able to access the site.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="allowRegistrations">Allow Registrations</Label>
                  <p className="text-sm text-gray-500">Allow new users to register</p>
                </div>
                <Switch
                  id="allowRegistrations"
                  checked={settings.allowRegistrations}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, allowRegistrations: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                  <p className="text-sm text-gray-500">Users must verify their email to use the platform</p>
                </div>
                <Switch
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, requireEmailVerification: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                  <p className="text-sm text-gray-500">Track usage statistics and analytics</p>
                </div>
                <Switch
                  id="enableAnalytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, enableAnalytics: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* User Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Limits</CardTitle>
              <CardDescription>Set limits for user accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxProjectsPerUser">Max Projects Per User</Label>
                <Input
                  id="maxProjectsPerUser"
                  type="number"
                  min="1"
                  max="100"
                  value={settings.maxProjectsPerUser}
                  onChange={(e) => 
                    setSettings({ ...settings, maxProjectsPerUser: parseInt(e.target.value) || 10 })
                  }
                />
                <p className="text-xs text-gray-500">
                  Maximum number of projects a free user can create
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="1440"
                  value={settings.sessionTimeout}
                  onChange={(e) => 
                    setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })
                  }
                />
                <p className="text-xs text-gray-500">
                  How long users stay logged in without activity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
