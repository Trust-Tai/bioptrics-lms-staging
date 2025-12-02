import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { QuizData } from '../../types/courseBuilder.types';

interface QuizCardProps {
  quiz: QuizData;
  moduleId: string;
  courseId: string;
  onDelete: (moduleId: string, quizId: string) => void;
  isEditing?: boolean;
  editingTitle?: string;
  onStartEdit?: (quizId: string, currentTitle: string) => void;
  onFinishEdit?: (moduleId: string, quizId: string) => void;
  onCancelEdit?: () => void;
  onTitleChange?: (title: string) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  moduleId,
  courseId,
  onDelete,
  isEditing = false,
  editingTitle = '',
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
  onTitleChange
}) => {
  const navigate = useNavigate();

  const handleEditQuiz = () => {
    navigate(`/content-library/builder/${courseId}/module/${moduleId}/quiz/${quiz.id}`);
  };

  const handleDeleteQuiz = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      onDelete(moduleId, quiz.id);
    }
  };

  const getQuizStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionCount = () => {
    return quiz.questions?.length || 0;
  };

  const getTotalPoints = () => {
    return quiz.questions?.reduce((total, question) => total + (question.points || 0), 0) || 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div 
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={handleEditQuiz}
        >
          {/* Quiz Icon */}
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => onTitleChange?.(e.target.value)}
                  onBlur={() => onFinishEdit?.(moduleId, quiz.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onFinishEdit?.(moduleId, quiz.id);
                    } else if (e.key === 'Escape') {
                      onCancelEdit?.();
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-gray-900 font-medium bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                  autoFocus
                />
              ) : (
                <span 
                  className="text-sm text-gray-900 font-medium hover:text-blue-600 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartEdit?.(quiz.id, quiz.title);
                  }}
                  title="Click to edit quiz title"
                >
                  {quiz.title}
                </span>
              )}
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getQuizStatusColor(quiz.status)}`}>
                {quiz.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{getQuestionCount()} question{getQuestionCount() !== 1 ? 's' : ''}</span>
              <span>{getTotalPoints()} point{getTotalPoints() !== 1 ? 's' : ''}</span>
              {quiz.settings?.timeLimit && quiz.settings.timeLimit > 0 && (
                <span>{quiz.settings.timeLimit} min</span>
              )}
              <span>Passing: {quiz.settings?.passingScore || 80}%</span>
            </div>
            
            {quiz.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {quiz.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleEditQuiz}
            className="text-xs"
          >
            EDIT
          </Button>
          
          <button
            onClick={handleDeleteQuiz}
            className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
            title="Delete quiz"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
