import React from 'react';
import type { Question } from '../../../../types/quiz.types';

interface QuestionEditorProps {
  question: Question | undefined;
  activeTab: 'outline' | 'content';
  onTabChange: (tab: 'outline' | 'content') => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  onAddQuestion: (type: Question['type']) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  activeTab,
  onTabChange,
  onUpdateQuestion,
  onAddQuestion
}) => {
  if (!question) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Question Selected</h3>
          <p className="text-gray-600 mb-6">Select a question from the sidebar or create a new one</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Create New Question:</h4>
            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              <button
                onClick={() => onAddQuestion('single-choice')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Single Choice
              </button>
              <button
                onClick={() => onAddQuestion('multiple-choice')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Multiple Choice
              </button>
              <button
                onClick={() => onAddQuestion('text-response')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Text Response
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex gap-6">
          <button
            onClick={() => onTabChange('outline')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'outline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Outline
          </button>
          <button
            onClick={() => onTabChange('content')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Content
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'outline' && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Outline</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Question Type</h4>
                <p className="text-sm text-gray-600">
                  {question.type === 'single-choice' && 'Single Choice - Students select one correct answer'}
                  {question.type === 'multiple-choice' && 'Multiple Choice - Students can select multiple correct answers'}
                  {question.type === 'text-response' && 'Text Response - Students provide written answers'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Points</h4>
                <p className="text-sm text-gray-600">{question.points} point{question.points !== 1 ? 's' : ''}</p>
              </div>

              {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Answer Options</h4>
                  <p className="text-sm text-gray-600">{question.options.length} option{question.options.length !== 1 ? 's' : ''}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="p-6">
            <div className="space-y-6">
              {/* Question Type Selector */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions</h3>
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => onAddQuestion('single-choice')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      question.type === 'single-choice'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-current"></div>
                    <span className="text-sm font-medium">single choice</span>
                  </button>
                  
                  <button
                    onClick={() => onAddQuestion('multiple-choice')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      question.type === 'multiple-choice'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-4 h-4 rounded border-2 border-current"></div>
                    <span className="text-sm font-medium">multiple choice</span>
                  </button>
                  
                  <button
                    onClick={() => onAddQuestion('text-response')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      question.type === 'text-response'
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="w-4 h-4 rounded border-2 border-current flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-current"></div>
                    </div>
                    <span className="text-sm font-medium">text response</span>
                  </button>
                </div>
              </div>

              {/* Question Content */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => onUpdateQuestion(question.id, { questionText: e.target.value })}
                      placeholder="Enter your question here..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options
                      </label>
                      <div className="space-y-2">
                        {question.options.map((option, index) => (
                          <div key={option.id} className="flex items-center gap-3">
                            <input
                              type={question.type === 'single-choice' ? 'radio' : 'checkbox'}
                              name={`question-${question.id}`}
                              checked={option.isCorrect}
                              onChange={(e) => {
                                const updatedOptions = question.options.map((opt, i) => {
                                  if (question.type === 'single-choice') {
                                    return { ...opt, isCorrect: i === index ? e.target.checked : false };
                                  } else {
                                    return i === index ? { ...opt, isCorrect: e.target.checked } : opt;
                                  }
                                });
                                onUpdateQuestion(question.id, { options: updatedOptions });
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => {
                                const updatedOptions = question.options.map((opt, i) =>
                                  i === index ? { ...opt, text: e.target.value } : opt
                                );
                                onUpdateQuestion(question.id, { options: updatedOptions });
                              }}
                              placeholder={`Option #${index + 1}`}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === 'text-response' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Type
                      </label>
                      <select
                        value={question.answerType}
                        onChange={(e) => onUpdateQuestion(question.id, { answerType: e.target.value as 'short' | 'long' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="short">Short Answer</option>
                        <option value="long">Long Answer (Essay)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
