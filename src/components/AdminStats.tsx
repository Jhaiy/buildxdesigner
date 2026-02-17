import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, DollarSign, TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Badge } from './ui/badge';


const stats = [
  {
    title: 'Total Users',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    description: 'Active registered users'
  },
  {
    title: 'Active Subscriptions',
    value: '1,284',
    change: '+8.2%',
    trend: 'up',
    icon: CreditCard,
    description: 'Currently active plans'
  },
  {
    title: 'Monthly Revenue',
    value: '$54,239',
    change: '+23.1%',
    trend: 'up',
    icon: DollarSign,
    description: 'Revenue this month'
  },
  {
    title: 'Growth Rate',
    value: '18.7%',
    change: '-2.4%',
    trend: 'down',
    icon: TrendingUp,
    description: 'User growth rate'
  }
];

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.trend === 'up';
        
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${
                isPositive ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <Icon className={`w-4 h-4 ${
                  isPositive ? 'text-green-600' : 'text-blue-600'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-gray-900">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{stat.description}</p>
                  <Badge 
                    variant={isPositive ? "default" : "secondary"}
                    className={`gap-1 ${
                      isPositive 
                        ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
