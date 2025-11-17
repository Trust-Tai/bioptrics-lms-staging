import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { SystemStatusItem } from '../../types/dashboard.types';

interface SystemStatusProps {
  statusItems: SystemStatusItem[];
}

const statusVariantMap = {
  healthy: 'success' as const,
  warning: 'warning' as const,
  error: 'error' as const,
  info: 'info' as const,
};

export const SystemStatus: React.FC<SystemStatusProps> = ({ statusItems }) => {
  return (
    <Card padding="md">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>

      <div className="space-y-4">
        {statusItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-base font-medium text-gray-600">{item.label}</span>
            <Badge variant={statusVariantMap[item.statusType]}>
              {item.status}
            </Badge>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm" className="w-full">
          Edit limit is Lovable
        </Button>
      </div>
    </Card>
  );
};
