import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { OrganizationsAtRisk } from '../../components/dashboard/OrganizationsAtRisk';
import { RecentCourseUpdates } from '../../components/dashboard/RecentCourseUpdates';
import { AdminControls } from '../../components/dashboard/AdminControls';
import { RevenueMetrics } from '../../components/dashboard/RevenueMetrics';
import { SystemStatus } from '../../components/dashboard/SystemStatus';
import { 
  statsData, 
  organizationsAtRisk, 
  recentCourseUpdates, 
  revenueMetrics, 
  systemStatus 
} from '../../data/mockData';

export const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-base text-gray-600 mt-1">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-base bg-white hover:border-gray-400 transition-colors cursor-pointer">
              <option>Org Admin</option>
              <option>Super Admin</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <OrganizationsAtRisk organizations={organizationsAtRisk} />
            <RecentCourseUpdates courses={recentCourseUpdates} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <AdminControls />
            <RevenueMetrics metrics={revenueMetrics} />
            <SystemStatus statusItems={systemStatus} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
