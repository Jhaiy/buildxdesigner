import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AdminUsersTable } from './AdminUsersTable';
import { AdminPlansTable } from './AdminPlansTable';
import { AdminStats } from './AdminStats';
import { AdminPlanManagement } from './AdminPlanManagement';
import { AdminGeneralSettings } from './AdminGeneralSettings';
import { AdminUserPermissions } from './AdminUserPermissions';
import { AdminExportData } from './AdminExportData';
import { AdminSidebar } from './AdminSidebar';
import { AdminNotifications } from './AdminNotifications';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Search,
  ArrowLeft,
  Settings,
  Bell,
  Download,
  Package,
  Shield,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';

interface AdminDashboardProps {
  onBack?: () => void;
  theme?: 'light' | 'dark' | 'system';
  onThemeChange?: (theme: 'light' | 'dark' | 'system') => void;
}

export default function AdminDashboard({ onBack, theme = 'dark', onThemeChange }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const [showUserPermissions, setShowUserPermissions] = useState(false);
  const [showExportData, setShowExportData] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false); // Start hidden on mobile

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Apply theme
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const handleLogout = () => {
    // Clear admin session
    sessionStorage.removeItem('codecraft-admin-session');
    // Redirect to landing page
    if (onBack) {
      onBack();
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Mobile Overlay */}
      {sidebarVisible && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar - Drawer on mobile, fixed on desktop */}
      <div className={`
        fixed md:relative
        z-50 md:z-auto
        transition-transform duration-300 ease-in-out
        ${sidebarVisible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        top-0 bottom-0 left-0
      `}>
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
                title={sidebarVisible ? "Hide sidebar" : "Show sidebar"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <div className="min-w-0">
                <h1 className="text-gray-900 dark:text-gray-100 text-base md:text-lg truncate">Admin Dashboard</h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Manage users and subscriptions</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48 lg:w-64"
                />
              </div>
              
              {/* Notifications */}
              <AdminNotifications />

              {/* Theme Switcher */}
              {onThemeChange && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ThemeIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onThemeChange('light')}>
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onThemeChange('dark')}>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onThemeChange('system')}>
                      <Monitor className="w-4 h-4 mr-2" />
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Admin Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowGeneralSettings(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    General Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowUserPermissions(true)}>
                    <Shield className="w-4 h-4 mr-2" />
                    User Permissions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowExportData(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          <TabsContent value="overview" className="space-y-6">
            <AdminStats />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminUsersTable limit={5} searchQuery={searchQuery} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Subscriptions</CardTitle>
                  <CardDescription>Latest plan purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminPlansTable limit={5} searchQuery={searchQuery} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all registered users</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setShowExportData(true);
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AdminUsersTable searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Subscription Management</CardTitle>
                    <CardDescription>Manage user subscriptions</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setShowExportData(true);
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Subscriptions
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AdminPlansTable searchQuery={searchQuery} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <AdminPlanManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>Platform performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Revenue</p>
                        <p className="text-3xl text-gray-900 dark:text-gray-100">$24,567</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">+12.5% from last month</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Projects</p>
                        <p className="text-3xl text-gray-900 dark:text-gray-100">3,421</p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8.3% from last month</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Conversion Rate</p>
                        <p className="text-3xl text-gray-900 dark:text-gray-100">4.8%</p>
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">-1.2% from last month</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <AdminStats />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Manage system configuration and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setShowGeneralSettings(true)}
                  >
                    <Settings className="w-6 h-6" />
                    <span>General Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setShowUserPermissions(true)}
                  >
                    <Shield className="w-6 h-6" />
                    <span>User Permissions</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                    onClick={() => setShowExportData(true)}
                  >
                    <Download className="w-6 h-6" />
                    <span>Export Data</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center gap-2"
                  >
                    <Package className="w-6 h-6" />
                    <span>Manage Plans</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modals */}
      <AdminGeneralSettings 
        open={showGeneralSettings} 
        onOpenChange={setShowGeneralSettings} 
      />
      <AdminUserPermissions 
        open={showUserPermissions} 
        onOpenChange={setShowUserPermissions} 
      />
      <AdminExportData 
        open={showExportData} 
        onOpenChange={setShowExportData} 
      />
      </div>
    </div>
  );
}
