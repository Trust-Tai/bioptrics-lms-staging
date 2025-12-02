import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { TopicData } from '../../types/courseBuilder.types';

interface TopicCardProps {
  topic: TopicData;
  moduleId: string;
  courseId?: string;
  onDelete: (moduleId: string, topicId: string) => void;
  isEditing?: boolean;
  editingTitle?: string;
  onStartEdit?: (topicId: string, currentTitle: string) => void;
  onFinishEdit?: (moduleId: string, topicId: string) => void;
  onCancelEdit?: () => void;
  onTitleChange?: (title: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  moduleId, 
  courseId = 'new-course',
  onDelete,
  isEditing = false,
  editingTitle = '',
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
  onTitleChange
}) => {
  const navigate = useNavigate();

  const handleEditTopic = () => {
    navigate(`/content-library/builder/${courseId}/module/${moduleId}/topic/${topic.id}`);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        {isEditing ? (
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => onTitleChange?.(e.target.value)}
            onBlur={() => onFinishEdit?.(moduleId, topic.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onFinishEdit?.(moduleId, topic.id);
              } else if (e.key === 'Escape') {
                onCancelEdit?.();
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-gray-900 flex-1 bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span 
            className="text-sm text-gray-900 flex-1 hover:text-blue-600 cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onStartEdit?.(topic.id, topic.title);
            }}
            title="Click to edit topic title"
          >
            {topic.title}
          </span>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={handleEditTopic}
          className="px-2 py-1 bg-orange-100 text-orange-600 rounded text-xs font-medium hover:bg-orange-200 transition-colors"
        >
          EDIT
        </button>
        <button
          onClick={() => onDelete(moduleId, topic.id)}
          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
