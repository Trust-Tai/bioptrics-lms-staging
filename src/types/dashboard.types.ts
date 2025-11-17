export interface StatCardData {
  label: string;
  value: string | number;
  icon: string;
}

export interface Organization {
  id: string;
  name: string;
  riskType: string;
  riskLevel: 'low' | 'medium' | 'high';
  seatsUsed: string;
  contactPerson: {
    name: string;
    avatar?: string;
  };
}

export interface CourseUpdate {
  id: string;
  title: string;
  status: 'Published' | 'Draft';
  marketplace: boolean;
  engagement: string;
  timeAgo: string;
}

export interface RevenueMetric {
  label: string;
  value: string;
  change?: string;
}

export interface SystemStatusItem {
  label: string;
  status: string;
  statusType: 'healthy' | 'warning' | 'error' | 'info';
}
