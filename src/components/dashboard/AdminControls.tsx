import React from 'react';
import { FileText, ShoppingBag, Building2, BarChart3, CreditCard } from 'lucide-react';
import { Card } from '../ui/Card';

const controlItems = [
  { id: 'content', label: 'Manage Content', icon: FileText },
  { id: 'marketplace', label: 'Marketplace Settings', icon: ShoppingBag },
  { id: 'organizations', label: 'View All Organizations', icon: Building2 },
  { id: 'reports', label: 'Global Reports', icon: BarChart3 },
  { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
];

export const AdminControls: React.FC = () => {
  return (
    <Card padding="md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Controls</h2>
      <div className="space-y-2">
        {controlItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:bg-primary-50 hover:border-primary-300 hover:shadow-sm transition-all duration-200 text-left"
            >
              <Icon size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-900">{item.label}</span>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
