import type { StatCardData, Organization, CourseUpdate, RevenueMetric, SystemStatusItem } from '../types/dashboard.types';

export const statsData: StatCardData[] = [
  { label: 'TOTAL COURSES', value: '156', icon: 'BookOpen' },
  { label: 'ACTIVE ORGS', value: '89', icon: 'Building2' },
  { label: 'MONTHLY ACTIVE USERS', value: '12.4K', icon: 'Users' },
  { label: 'AVG COMPLETION', value: '76%', icon: 'TrendingUp' },
  { label: 'CERTIFICATES ISSUED', value: '8,924', icon: 'Award' },
  { label: 'MRR', value: '$127K', icon: 'DollarSign' },
];

export const organizationsAtRisk: Organization[] = [
  {
    id: '1',
    name: 'Acme Corp',
    riskType: 'Low utilization (23%)',
    riskLevel: 'medium',
    seatsUsed: '50/1000 seats used',
    contactPerson: {
      name: 'Sarah Johnson',
      avatar: 'SJ',
    },
  },
  {
    id: '2',
    name: 'Tech Industries',
    riskType: 'High overdue rate (34%)',
    riskLevel: 'high',
    seatsUsed: '145/260 seats used',
    contactPerson: {
      name: 'Michael Chen',
      avatar: 'MC',
    },
  },
  {
    id: '3',
    name: 'Global Services',
    riskType: 'Expiring contract (30d)',
    riskLevel: 'medium',
    seatsUsed: '890/1000 seats used',
    contactPerson: {
      name: 'Emily Rodriguez',
      avatar: 'ER',
    },
  },
];

export const recentCourseUpdates: CourseUpdate[] = [
  {
    id: '1',
    title: 'Advanced Leadership Skills',
    status: 'Published',
    marketplace: true,
    engagement: '12 orgs',
    timeAgo: '2 days ago',
  },
  {
    id: '2',
    title: 'Compliance 2025 Update',
    status: 'Published',
    marketplace: true,
    engagement: '34 orgs',
    timeAgo: '1 week ago',
  },
  {
    id: '3',
    title: 'Remote Work Best Practices',
    status: 'Draft',
    marketplace: false,
    engagement: '0 orgs',
    timeAgo: 'In progress',
  },
];

export const revenueMetrics: RevenueMetric[] = [
  { label: 'MRR', value: '$127,450' },
  { label: 'ARR', value: '$1.53M' },
  { label: 'Growth', value: '+18% vs last month', change: '+18%' },
];

export const systemStatus: SystemStatusItem[] = [
  { label: 'Content Delivery', status: 'Healthy', statusType: 'healthy' },
  { label: 'API Performance', status: '99.8%', statusType: 'healthy' },
  { label: 'Active Sessions', status: '2,847', statusType: 'info' },
];
