import React from 'react';
import { BookOpen, Building2, Users, TrendingUp, Award, DollarSign } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '../ui/Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Building2,
  Users,
  TrendingUp,
  Award,
  DollarSign,
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  const Icon = iconMap[icon] || BookOpen;
  
  return (
    <Card padding="md" className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-primary-100 transition-colors">
          <Icon size={20} className="text-gray-600" />
        </div>
      </div>
    </Card>
  );
};
