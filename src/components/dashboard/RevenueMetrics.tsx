import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { RevenueMetric } from '../../types/dashboard.types';

interface RevenueMetricsProps {
  metrics: RevenueMetric[];
}

export const RevenueMetrics: React.FC<RevenueMetricsProps> = ({ metrics }) => {
  return (
    <Card padding="md">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Revenue Metrics</h2>
        <p className="text-base text-gray-600 mt-1">Current month</p>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-base font-medium text-gray-600">{metric.label}</span>
            <div className="text-right">
              <span className="text-xl font-bold text-gray-900">{metric.value}</span>
              {metric.change && (
                <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                  <TrendingUp size={12} />
                  <span>{metric.change}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="md" className="w-full mt-6">
        View Detailed Analytics
      </Button>
    </Card>
  );
};
