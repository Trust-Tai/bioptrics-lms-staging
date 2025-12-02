import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Question } from '../../../../types/quiz.types';

interface QuestionSidebarProps {
  questions: Question[];
  selectedQuestionId: string | null;
  onQuestionSelect: (questionId: string) => void;
  onAddQuestion: (type: Question['type']) => void;
  onDeleteQuestion: (questionId: string) => void;
}

export const QuestionSidebar: React.FC<QuestionSidebarProps> = ({
  questions,
  selectedQuestionId,
  onQuestionSelect,
  onAddQuestion,
  onDeleteQuestion
}) => {
  const getQuestionTypeLabel = (type: Question['type']) => {
    switch (type) {
      case 'single-choice':
        return 'SINGLE CHOICE';
      case 'multiple-choice':
        return 'MULTIPLE CHOICE';
      case 'text-response':
        return 'TEXT RESPONSE';
      default:
        return 'QUESTION';
    }
  };

  const getQuestionTypeColor = (type: Question['type']) => {
    switch (type) {
      case 'single-choice':
        return 'bg-blue-100 text-blue-800';
      case 'multiple-choice':
        return 'bg-green-100 text-green-800';
      case 'text-response':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
          
          {questions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No questions yet</p>
              <p className="text-xs text-gray-400 mt-1">Add your first question below</p>
            </div>
          ) : (
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedQuestionId === question.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onQuestionSelect(question.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getQuestionTypeColor(question.type)}`}>
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuestionSelect(question.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title="Edit question"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteQuestion(question.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete question"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {question.questionText || 'Enter your question here...'}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>Question {index + 1}</span>
                    <span>{question.points} point{question.points !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Add Question Button */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-2">
          <button
            onClick={() => onAddQuestion('single-choice')}
            className="w-full p-3 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Add Question</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
