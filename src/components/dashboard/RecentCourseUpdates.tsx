import React from 'react';
import { BookOpen, Eye, Edit } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { CourseUpdate } from '../../types/dashboard.types';

interface RecentCourseUpdatesProps {
  courses: CourseUpdate[];
}

export const RecentCourseUpdates: React.FC<RecentCourseUpdatesProps> = ({ courses }) => {
  return (
    <Card padding="none">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Course Updates</h2>
            <p className="text-base text-gray-600 mt-1">Latest content activity</p>
          </div>
          <Button variant="primary" size="sm">
            Create Course
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {courses.map((course) => (
          <div key={course.id} className="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <BookOpen size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">{course.title}</h3>
                    <Badge variant={course.status === 'Published' ? 'info' : 'default'}>
                      {course.status}
                    </Badge>
                    {course.marketplace && (
                      <span className="text-xs text-gray-600">• Marketplace</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {course.engagement} • {course.timeAgo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {course.status === 'Draft' ? (
                  <Button variant="outline" size="sm">
                    <Eye size={16} className="mr-1" />
                    Publish
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm">
                    <Eye size={16} className="mr-1" />
                    Unpublish
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
