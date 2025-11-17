import React from 'react';
import { Building2, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Organization } from '../../types/dashboard.types';

interface OrganizationsAtRiskProps {
  organizations: Organization[];
}

export const OrganizationsAtRisk: React.FC<OrganizationsAtRiskProps> = ({ organizations }) => {
  return (
    <Card padding="none">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Organizations at Risk</h2>
            <p className="text-base text-gray-600 mt-1">Require attention or intervention</p>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {organizations.map((org) => (
          <div key={org.id} className="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Building2 size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900">{org.name}</h3>
                  <p className="text-sm text-red-600 mt-1">{org.riskType}</p>
                  <p className="text-sm text-gray-500 mt-1">{org.seatsUsed}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{org.contactPerson.name}</span>
                </div>
                <Button variant="outline" size="sm">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
