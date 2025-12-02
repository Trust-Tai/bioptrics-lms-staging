import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import type { Quiz } from '../../../../types/quiz.types';

interface QuizHeaderProps {
  quiz: Quiz;
  courseId?: string;
  moduleId?: string;
  hasUnsavedChanges: boolean;
  onNavigateBack: () => void;
  onPublish: () => void;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({
  quiz,
  courseId: _courseId,
  moduleId,
  hasUnsavedChanges,
  onNavigateBack,
  onPublish
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <button 
              onClick={onNavigateBack}
              className="hover:text-gray-900"
            >
              Course Overview
            </button>
            <span>→</span>
            <button 
              onClick={onNavigateBack}
              className="hover:text-gray-900"
            >
              Module #{moduleId}: Welcome and Overview
            </button>
            <span>→</span>
            <span className="text-gray-900 font-medium">{quiz.title}</span>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-sm text-amber-600">Unsaved changes</span>
          )}
          <Button 
            variant="primary" 
            className="bg-orange-500 hover:bg-orange-600"
            onClick={onPublish}
          >
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
};
