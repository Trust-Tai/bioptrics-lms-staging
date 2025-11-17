import React from 'react';
import { LayoutDashboard, BookOpen, ShoppingBag, Building2, BarChart3, FileText, Settings, ArrowLeft } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
}

const administrationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'content-library', label: 'Content Library', icon: BookOpen },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
];

const managementItems = [
  { id: 'organizations', label: 'Organizations', icon: Building2 },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'billing', label: 'Billing', icon: FileText },
];

const systemItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard' }) => {
  return (
    <div className="w-64 bg-beige-100 h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
            L
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Learn</h1>
            <p className="text-xs text-gray-600">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {/* Administration Section */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Administration
          </p>
          {administrationItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Management Section */}
        <div className="space-y-1 mt-6">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Management
          </p>
          {managementItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* System Section */}
        <div className="space-y-1 mt-6">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            System
          </p>
          {systemItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-700 hover:bg-white/50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings Section */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-primary-600 hover:bg-white/50 transition-colors">
          <ArrowLeft size={18} />
          <span>Back to Pulse</span>
        </button>
      </div>
    </div>
  );
};
