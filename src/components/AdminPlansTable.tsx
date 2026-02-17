import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { MoreVertical, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  amount: number;
  paymentMethod: string;
}

// Mock data - in production, this would come from your backend/Supabase
const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    plan: 'Pro',
    status: 'active',
    startDate: '2025-01-15',
    endDate: '2026-01-15',
    amount: 29.99,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'sub_2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@example.com',
    plan: 'Enterprise',
    status: 'active',
    startDate: '2025-02-01',
    endDate: '2026-02-01',
    amount: 99.99,
    paymentMethod: 'PayPal'
  },
  {
    id: 'sub_3',
    userName: 'Alice Johnson',
    userEmail: 'alice.j@example.com',
    plan: 'Pro',
    status: 'pending',
    startDate: '2025-03-10',
    endDate: '2026-03-10',
    amount: 29.99,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'sub_4',
    userName: 'Diana Prince',
    userEmail: 'diana.p@example.com',
    plan: 'Enterprise',
    status: 'active',
    startDate: '2025-01-20',
    endDate: '2026-01-20',
    amount: 99.99,
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'sub_5',
    userName: 'Ethan Hunt',
    userEmail: 'ethan.h@example.com',
    plan: 'Pro',
    status: 'cancelled',
    startDate: '2024-12-01',
    endDate: '2025-12-01',
    amount: 29.99,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'sub_6',
    userName: 'Bob Wilson',
    userEmail: 'bob.wilson@example.com',
    plan: 'Free',
    status: 'active',
    startDate: '2024-12-10',
    endDate: '-',
    amount: 0,
    paymentMethod: '-'
  },
  {
    id: 'sub_7',
    userName: 'Charlie Brown',
    userEmail: 'charlie.b@example.com',
    plan: 'Pro',
    status: 'expired',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    amount: 29.99,
    paymentMethod: 'Credit Card'
  },
  {
    id: 'sub_8',
    userName: 'Fiona Gallagher',
    userEmail: 'fiona.g@example.com',
    plan: 'Free',
    status: 'active',
    startDate: '2024-10-30',
    endDate: '-',
    amount: 0,
    paymentMethod: '-'
  }
];

interface AdminPlansTableProps {
  limit?: number;
  searchQuery?: string;
}

export function AdminPlansTable({ limit, searchQuery = '' }: AdminPlansTableProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredSubscriptions = useMemo(() => {
    let filtered = subscriptions;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (sub) =>
          sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    }

    // Apply plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter((sub) => sub.plan === planFilter);
    }

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [subscriptions, searchQuery, statusFilter, planFilter, limit]);

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingSubscription) {
      setSubscriptions(
        subscriptions.map((s) => (s.id === editingSubscription.id ? editingSubscription : s))
      );
      setIsEditDialogOpen(false);
      setEditingSubscription(null);
    }
  };

  const handleApprove = (subId: string) => {
    setSubscriptions(
      subscriptions.map((s) => (s.id === subId ? { ...s, status: 'active' } : s))
    );
  };

  const handleReject = (subId: string) => {
    if (confirm('Are you sure you want to reject this subscription?')) {
      setSubscriptions(
        subscriptions.map((s) => (s.id === subId ? { ...s, status: 'cancelled' } : s))
      );
    }
  };

  const getStatusBadge = (status: Subscription['status']) => {
    const variants = {
      active: { className: 'bg-green-100 text-green-700 hover:bg-green-100', icon: CheckCircle },
      pending: { className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100', icon: Clock },
      cancelled: { className: 'bg-red-100 text-red-700 hover:bg-red-100', icon: XCircle },
      expired: { className: 'bg-gray-100 text-gray-700 hover:bg-gray-100', icon: XCircle },
    };

    const { className, icon: Icon } = variants[status];

    return (
      <Badge className={`${className} gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPlanBadge = (plan: string) => {
    const variants: Record<string, string> = {
      Free: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
      Pro: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
      Enterprise: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
    };

    return <Badge className={variants[plan] || variants.Free}>{plan}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      {!limit && (
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Free">Free</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              {!limit && <TableHead>Start Date</TableHead>}
              {!limit && <TableHead>End Date</TableHead>}
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={limit ? 5 : 7} className="text-center text-gray-500">
                  No subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>
                    <div>
                      <div className="text-gray-900">{subscription.userName}</div>
                      <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(subscription.plan)}</TableCell>
                  <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                  {!limit && <TableCell className="text-gray-600">{subscription.startDate}</TableCell>}
                  {!limit && <TableCell className="text-gray-600">{subscription.endDate}</TableCell>}
                  <TableCell>
                    <div className="flex items-center gap-1 text-gray-900">
                      <DollarSign className="w-4 h-4" />
                      {subscription.amount.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(subscription)}>
                          Edit Subscription
                        </DropdownMenuItem>
                        {subscription.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleApprove(subscription.id)}
                              className="text-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReject(subscription.id)}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {subscription.status === 'active' && (
                          <DropdownMenuItem
                            onClick={() => handleReject(subscription.id)}
                            className="text-red-600"
                          >
                            Cancel Subscription
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>Update subscription details</DialogDescription>
          </DialogHeader>
          {editingSubscription && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Select
                  value={editingSubscription.plan}
                  onValueChange={(value) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      plan: value as Subscription['plan'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingSubscription.status}
                  onValueChange={(value) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      status: value as Subscription['status'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={editingSubscription.amount}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editingSubscription.endDate}
                  onChange={(e) =>
                    setEditingSubscription({
                      ...editingSubscription,
                      endDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
