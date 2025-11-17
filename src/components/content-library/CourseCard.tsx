import React, { useState, useRef, useEffect } from 'react';
import { Star, MoreVertical, Edit, Eye, Copy, Trash2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Course } from '../../types/course.types';

interface CourseCardProps {
  course: Course;
  onEdit: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
  const statusVariant = course.status === 'published' ? 'success' : 'default';
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    switch (action) {
      case 'edit':
        onEdit(course.id);
        break;
      case 'preview':
        console.log('Preview course:', course.id);
        break;
      case 'duplicate':
        console.log('Duplicate course:', course.id);
        break;
      case 'delete':
        console.log('Delete course:', course.id);
        break;
    }
  };

  return (
    <Card padding="md" className="hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <Badge variant={statusVariant} className="capitalize">
          {course.status}
        </Badge>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => handleMenuAction('edit')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleMenuAction('preview')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Eye size={16} />
                <span>Preview</span>
              </button>
              <button
                onClick={() => handleMenuAction('duplicate')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Copy size={16} />
                <span>Duplicate</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={() => handleMenuAction('delete')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
      <p className="text-sm text-gray-600 mb-4">{course.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{course.blocks} blocks</span>
        <span>Edited {course.editedDate}</span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{course.purchases} purchases</span>
          {course.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium text-gray-900">{course.rating}</span>
            </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => onEdit(course.id)}>
          Edit Course
        </Button>
      </div>
    </Card>
  );
};
