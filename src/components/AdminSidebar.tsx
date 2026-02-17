import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Package, 
  Settings, 
  TrendingUp,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'users',
      label: 'Users',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: 'plans',
      label: 'Plan Management',
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Admin Profile */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10 ring-2 ring-blue-500/50">
            <AvatarImage src="/avatars/admin.png" alt="Admin" />
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-gray-900 dark:text-gray-100">Administrator</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">admin@codecraft.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          <p className="px-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {activeTab === item.id && (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-1">
          <p className="px-3 text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            System
          </p>
          <button
            onClick={() => onTabChange('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              activeTab === 'settings'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="flex-1 text-left text-sm">Settings</span>
            {activeTab === 'settings' && (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </ScrollArea>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
