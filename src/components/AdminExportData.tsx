import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { Download, FileJson, FileText, Database, Users, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';

interface AdminExportDataProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExportFormat = 'csv' | 'json';
type ExportType = 'users' | 'subscriptions' | 'analytics' | 'all';

interface ExportOptions {
  format: ExportFormat;
  type: ExportType;
  includeMetadata: boolean;
  dateRange: 'all' | '30days' | '90days' | 'year';
  fields: {
    users: string[];
    subscriptions: string[];
    analytics: string[];
  };
}

const USER_FIELDS = [
  { id: 'email', label: 'Email Address' },
  { id: 'name', label: 'Full Name' },
  { id: 'role', label: 'User Role' },
  { id: 'plan', label: 'Subscription Plan' },
  { id: 'status', label: 'Account Status' },
  { id: 'joinDate', label: 'Join Date' },
  { id: 'lastLogin', label: 'Last Login' },
  { id: 'projectCount', label: 'Project Count' },
];

const SUBSCRIPTION_FIELDS = [
  { id: 'user', label: 'User' },
  { id: 'plan', label: 'Plan Name' },
  { id: 'status', label: 'Status' },
  { id: 'startDate', label: 'Start Date' },
  { id: 'renewalDate', label: 'Renewal Date' },
  { id: 'amount', label: 'Amount' },
  { id: 'paymentMethod', label: 'Payment Method' },
];

const ANALYTICS_FIELDS = [
  { id: 'date', label: 'Date' },
  { id: 'activeUsers', label: 'Active Users' },
  { id: 'newUsers', label: 'New Users' },
  { id: 'projectsCreated', label: 'Projects Created' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'conversions', label: 'Conversions' },
];

export function AdminExportData({ open, onOpenChange }: AdminExportDataProps) {
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    type: 'users',
    includeMetadata: true,
    dateRange: 'all',
    fields: {
      users: USER_FIELDS.map(f => f.id),
      subscriptions: SUBSCRIPTION_FIELDS.map(f => f.id),
      analytics: ANALYTICS_FIELDS.map(f => f.id),
    },
  });

  const [isExporting, setIsExporting] = useState(false);

  const toggleField = (category: keyof ExportOptions['fields'], fieldId: string) => {
    setOptions(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [category]: prev.fields[category].includes(fieldId)
          ? prev.fields[category].filter(f => f !== fieldId)
          : [...prev.fields[category], fieldId],
      },
    }));
  };

  const selectAllFields = (category: keyof ExportOptions['fields']) => {
    const allFields = category === 'users' ? USER_FIELDS
      : category === 'subscriptions' ? SUBSCRIPTION_FIELDS
      : ANALYTICS_FIELDS;
    
    setOptions(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [category]: allFields.map(f => f.id),
      },
    }));
  };

  const deselectAllFields = (category: keyof ExportOptions['fields']) => {
    setOptions(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [category]: [],
      },
    }));
  };

  const generateMockData = () => {
    const mockUsers = [
      { email: 'john.doe@example.com', name: 'John Doe', role: 'Free User', plan: 'Free', status: 'Active', joinDate: '2024-01-15', lastLogin: '2024-10-20', projectCount: 5 },
      { email: 'jane.smith@example.com', name: 'Jane Smith', role: 'Pro User', plan: 'Pro', status: 'Active', joinDate: '2024-02-20', lastLogin: '2024-10-21', projectCount: 12 },
      { email: 'bob.wilson@example.com', name: 'Bob Wilson', role: 'Enterprise User', plan: 'Enterprise', status: 'Active', joinDate: '2024-03-10', lastLogin: '2024-10-19', projectCount: 24 },
    ];

    const mockSubscriptions = [
      { user: 'jane.smith@example.com', plan: 'Pro', status: 'Active', startDate: '2024-02-20', renewalDate: '2024-11-20', amount: '$29/mo', paymentMethod: 'Credit Card' },
      { user: 'bob.wilson@example.com', plan: 'Enterprise', status: 'Active', startDate: '2024-03-10', renewalDate: '2024-12-10', amount: '$99/mo', paymentMethod: 'Invoice' },
    ];

    const mockAnalytics = [
      { date: '2024-10-15', activeUsers: 1247, newUsers: 45, projectsCreated: 123, revenue: '$4,567', conversions: 12 },
      { date: '2024-10-16', activeUsers: 1289, newUsers: 52, projectsCreated: 145, revenue: '$5,234', conversions: 15 },
      { date: '2024-10-17', activeUsers: 1312, newUsers: 38, projectsCreated: 167, revenue: '$4,891', conversions: 11 },
    ];

    return { mockUsers, mockSubscriptions, mockAnalytics };
  };

  const convertToCSV = (data: any[], fields: string[]) => {
    const header = fields.join(',');
    const rows = data.map(item => 
      fields.map(field => {
        const value = item[field] || '';
        // Escape commas and quotes in CSV
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );
    return [header, ...rows].join('\n');
  };

  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      const { mockUsers, mockSubscriptions, mockAnalytics } = generateMockData();
      let content = '';
      let filename = '';

      if (options.type === 'users') {
        filename = `users-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
        const filteredData = mockUsers.map(user => {
          const filtered: any = {};
          options.fields.users.forEach(field => {
            filtered[field] = user[field as keyof typeof user];
          });
          return filtered;
        });

        content = options.format === 'csv' 
          ? convertToCSV(filteredData, options.fields.users)
          : JSON.stringify(filteredData, null, 2);
      } else if (options.type === 'subscriptions') {
        filename = `subscriptions-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
        const filteredData = mockSubscriptions.map(sub => {
          const filtered: any = {};
          options.fields.subscriptions.forEach(field => {
            filtered[field] = sub[field as keyof typeof sub];
          });
          return filtered;
        });

        content = options.format === 'csv' 
          ? convertToCSV(filteredData, options.fields.subscriptions)
          : JSON.stringify(filteredData, null, 2);
      } else if (options.type === 'analytics') {
        filename = `analytics-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
        const filteredData = mockAnalytics.map(item => {
          const filtered: any = {};
          options.fields.analytics.forEach(field => {
            filtered[field] = item[field as keyof typeof item];
          });
          return filtered;
        });

        content = options.format === 'csv' 
          ? convertToCSV(filteredData, options.fields.analytics)
          : JSON.stringify(filteredData, null, 2);
      } else {
        // Export all data
        filename = `complete-export-${new Date().toISOString().split('T')[0]}.${options.format}`;
        const allData = {
          users: mockUsers,
          subscriptions: mockSubscriptions,
          analytics: mockAnalytics,
          metadata: options.includeMetadata ? {
            exportDate: new Date().toISOString(),
            exportedBy: 'admin',
            dateRange: options.dateRange,
            format: options.format,
          } : undefined,
        };

        content = options.format === 'json' 
          ? JSON.stringify(allData, null, 2)
          : 'Export all data as CSV is only available for individual data types. Please select Users, Subscriptions, or Analytics.';
      }

      // Create download
      const blob = new Blob([content], { 
        type: options.format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      toast.success(`Data exported successfully as ${options.format.toUpperCase()}`);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Data
          </DialogTitle>
          <DialogDescription>
            Export user data, subscriptions, and analytics in various formats
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Export Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What to Export</CardTitle>
              <CardDescription>Select the type of data to export</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={options.type}
                onValueChange={(value) => setOptions({ ...options, type: value as ExportType })}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="users" id="users" />
                    <Label htmlFor="users" className="flex items-center gap-2 cursor-pointer">
                      <Users className="w-4 h-4" />
                      User Data
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="subscriptions" id="subscriptions" />
                    <Label htmlFor="subscriptions" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="w-4 h-4" />
                      Subscriptions
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="analytics" id="analytics" />
                    <Label htmlFor="analytics" className="flex items-center gap-2 cursor-pointer">
                      <TrendingUp className="w-4 h-4" />
                      Analytics
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
                      <Database className="w-4 h-4" />
                      All Data
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Export Format */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Format</CardTitle>
              <CardDescription>Choose the file format</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={options.format}
                onValueChange={(value) => setOptions({ ...options, format: value as ExportFormat })}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="csv" id="csv" />
                    <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                      <FileText className="w-4 h-4" />
                      CSV (Spreadsheet)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="json" id="json" />
                    <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer">
                      <FileJson className="w-4 h-4" />
                      JSON (Structured)
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </CardTitle>
              <CardDescription>Filter data by date range</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={options.dateRange}
                onValueChange={(value) => setOptions({ ...options, dateRange: value as any })}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all-time" />
                    <Label htmlFor="all-time">All Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30days" id="30days" />
                    <Label htmlFor="30days">Last 30 Days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90days" id="90days" />
                    <Label htmlFor="90days">Last 90 Days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="year" id="year" />
                    <Label htmlFor="year">Last Year</Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Field Selection */}
          {options.type !== 'all' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Select Fields</CardTitle>
                    <CardDescription>Choose which fields to include</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => selectAllFields(options.type as keyof ExportOptions['fields'])}
                    >
                      Select All
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deselectAllFields(options.type as keyof ExportOptions['fields'])}
                    >
                      Deselect All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(options.type === 'users' ? USER_FIELDS
                    : options.type === 'subscriptions' ? SUBSCRIPTION_FIELDS
                    : ANALYTICS_FIELDS
                  ).map((field) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={field.id}
                        checked={options.fields[options.type as keyof ExportOptions['fields']].includes(field.id)}
                        onCheckedChange={() => toggleField(options.type as keyof ExportOptions['fields'], field.id)}
                      />
                      <Label htmlFor={field.id} className="cursor-pointer">
                        {field.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="metadata">Include Metadata</Label>
                  <p className="text-sm text-gray-500">Add export date, user, and settings</p>
                </div>
                <Switch
                  id="metadata"
                  checked={options.includeMetadata}
                  onCheckedChange={(checked) => setOptions({ ...options, includeMetadata: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
