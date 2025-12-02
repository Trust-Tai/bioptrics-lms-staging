import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ArrowLeft } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
}

const navigationItems = [
  { id: 'content-library', label: 'Content Library', icon: BookOpen, path: '/content-library' },
];

export const Sidebar: React.FC<SidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

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
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Administration
          </p>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
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
