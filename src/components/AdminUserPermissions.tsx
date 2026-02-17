import { useState, useEffect } from 'react';
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
import { Shield, Users, Edit, Trash2, Plus, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AdminUserPermissionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  permissions: string[];
  userCount: number;
}

const DEFAULT_PERMISSIONS: Permission[] = [
  { id: 'create_projects', name: 'Create Projects', description: 'Create new projects', enabled: true },
  { id: 'delete_projects', name: 'Delete Projects', description: 'Delete own projects', enabled: true },
  { id: 'export_code', name: 'Export Code', description: 'Export project code', enabled: true },
  { id: 'use_ai', name: 'Use AI Features', description: 'Access AI design generator', enabled: true },
  { id: 'publish_sites', name: 'Publish Sites', description: 'Publish projects to web', enabled: false },
  { id: 'manage_team', name: 'Manage Team', description: 'Invite team members', enabled: false },
  { id: 'access_analytics', name: 'Access Analytics', description: 'View project analytics', enabled: false },
  { id: 'custom_domain', name: 'Custom Domain', description: 'Use custom domains', enabled: false },
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'free',
    name: 'Free User',
    description: 'Basic access with limited features',
    color: 'gray',
    permissions: ['create_projects', 'delete_projects', 'export_code'],
    userCount: 1247,
  },
  {
    id: 'pro',
    name: 'Pro User',
    description: 'Full access to all features',
    color: 'blue',
    permissions: ['create_projects', 'delete_projects', 'export_code', 'use_ai', 'publish_sites', 'access_analytics'],
    userCount: 342,
  },
  {
    id: 'enterprise',
    name: 'Enterprise User',
    description: 'Complete access with team features',
    color: 'purple',
    permissions: ['create_projects', 'delete_projects', 'export_code', 'use_ai', 'publish_sites', 'manage_team', 'access_analytics', 'custom_domain'],
    userCount: 89,
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    color: 'red',
    permissions: ['create_projects', 'delete_projects', 'export_code', 'use_ai', 'publish_sites', 'manage_team', 'access_analytics', 'custom_domain'],
    userCount: 5,
  },
];

export function AdminUserPermissions({ open, onOpenChange }: AdminUserPermissionsProps) {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [permissions, setPermissions] = useState<Permission[]>(DEFAULT_PERMISSIONS);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const savedRoles = localStorage.getItem('codecraft-admin-roles');
    const savedPermissions = localStorage.getItem('codecraft-admin-permissions');
    
    if (savedRoles) {
      try {
        setRoles(JSON.parse(savedRoles));
      } catch (error) {
        console.error('Failed to load roles:', error);
      }
    }
    
    if (savedPermissions) {
      try {
        setPermissions(JSON.parse(savedPermissions));
      } catch (error) {
        console.error('Failed to load permissions:', error);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem('codecraft-admin-roles', JSON.stringify(roles));
      localStorage.setItem('codecraft-admin-permissions', JSON.stringify(permissions));
      setIsSaving(false);
      toast.success('Permissions saved successfully');
    }, 800);
  };

  const toggleRolePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permissionId);
        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p !== permissionId)
            : [...role.permissions, permissionId],
        };
      }
      return role;
    }));
  };

  const deleteRole = (roleId: string) => {
    if (roles.length <= 1) {
      toast.error('Cannot delete the last role');
      return;
    }
    setRoles(roles.filter(r => r.id !== roleId));
    toast.success('Role deleted');
  };

  const addRole = () => {
    if (!newRoleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    const newRole: Role = {
      id: `role_${Date.now()}`,
      name: newRoleName,
      description: 'Custom role',
      color: 'green',
      permissions: [],
      userCount: 0,
    };

    setRoles([...roles, newRole]);
    setNewRoleName('');
    setIsAddingRole(false);
    toast.success('Role created');
  };

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700',
      red: 'bg-red-100 text-red-700',
      green: 'bg-green-100 text-green-700',
    };
    return colors[color] || colors.gray;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Permissions & Roles
          </DialogTitle>
          <DialogDescription>
            Manage user roles and their permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Roles Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Roles</CardTitle>
                  <CardDescription>Define user roles and assign permissions</CardDescription>
                </div>
                <Button size="sm" onClick={() => setIsAddingRole(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedRole === role.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getColorClass(role.color)}>
                          {role.name}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {role.userCount} users
                        </span>
                      </div>
                      {role.id !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteRole(role.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{role.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {role.permissions.length} permissions assigned
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Role Form */}
              {isAddingRole && (
                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Role name"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addRole()}
                    />
                    <Button onClick={addRole}>Add</Button>
                    <Button variant="outline" onClick={() => {
                      setIsAddingRole(false);
                      setNewRoleName('');
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissions Matrix */}
          {selectedRole && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Permissions for {roles.find(r => r.id === selectedRole)?.name}
                </CardTitle>
                <CardDescription>
                  Configure what this role can do
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {permissions.map((permission) => {
                    const role = roles.find(r => r.id === selectedRole);
                    const hasPermission = role?.permissions.includes(permission.id);

                    return (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div className="space-y-0.5">
                          <Label htmlFor={permission.id}>{permission.name}</Label>
                          <p className="text-sm text-gray-500">{permission.description}</p>
                        </div>
                        <Switch
                          id={permission.id}
                          checked={hasPermission}
                          onCheckedChange={() => toggleRolePermission(selectedRole, permission.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Permissions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">All Permissions</CardTitle>
              <CardDescription>Overview of all available permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Roles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission) => {
                    const rolesWithPermission = roles.filter(r =>
                      r.permissions.includes(permission.id)
                    );

                    return (
                      <TableRow key={permission.id}>
                        <TableCell>{permission.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {permission.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            {rolesWithPermission.map((role) => (
                              <Badge
                                key={role.id}
                                variant="outline"
                                className={getColorClass(role.color)}
                              >
                                {role.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
