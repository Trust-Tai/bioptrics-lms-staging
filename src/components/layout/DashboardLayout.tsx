import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-beige-50">
      <Sidebar />
      <main className="ml-64 overflow-auto">
        {children}
      </main>
    </div>
  );
};
