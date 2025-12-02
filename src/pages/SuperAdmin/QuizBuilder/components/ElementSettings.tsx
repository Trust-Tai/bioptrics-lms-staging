import React from 'react';
import type { Question } from '../../../../types/quiz.types';

interface ElementSettingsProps {
  question: Question | undefined;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
}

export const ElementSettings: React.FC<ElementSettingsProps> = ({
  question,
  onUpdateQuestion
}) => {
  if (!question) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Element Settings</h3>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Select a question to view settings</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddOption = () => {
    if (question.type === 'single-choice' || question.type === 'multiple-choice') {
      const newOption = {
        id: `opt-${Date.now()}`,
        text: `Option #${question.options.length + 1}`,
        isCorrect: false
      };
      onUpdateQuestion(question.id, {
        options: [...question.options, newOption]
      });
    }
  };

  const handleRemoveOption = (optionId: string) => {
    if (question.type === 'single-choice' || question.type === 'multiple-choice') {
      onUpdateQuestion(question.id, {
        options: question.options.filter(opt => opt.id !== optionId)
      });
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Element Settings</h3>
          
          <div className="space-y-6">
            {/* Image Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Source
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="question-image"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      onUpdateQuestion(question.id, { imageUrl });
                    }
                  }}
                />
                <label
                  htmlFor="question-image"
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Choose File
                </label>
                {question.imageUrl && (
                  <div className="relative">
                    <img
                      src={question.imageUrl}
                      alt="Question"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => onUpdateQuestion(question.id, { imageUrl: undefined })}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={question.questionText}
                onChange={(e) => onUpdateQuestion(question.id, { questionText: e.target.value })}
                placeholder="Enter your question here..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Answer Options (for choice questions) */}
            {(question.type === 'single-choice' || question.type === 'multiple-choice') && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer Options
                  </label>
                  <button
                    onClick={handleAddOption}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <div key={option.id} className="flex items-center gap-2">
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
                        className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {question.options.length > 2 && (
                        <button
                          onClick={() => handleRemoveOption(option.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Remove option"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Text Response Settings */}
            {question.type === 'text-response' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Type
                  </label>
                  <select
                    value={question.answerType}
                    onChange={(e) => onUpdateQuestion(question.id, { answerType: e.target.value as 'short' | 'long' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="short">Short Answer</option>
                    <option value="long">Long Answer (Essay)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Character Limit (Optional)
                  </label>
                  <input
                    type="number"
                    value={question.maxCharacters || ''}
                    onChange={(e) => onUpdateQuestion(question.id, { 
                      maxCharacters: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="No limit"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={question.caseSensitive || false}
                      onChange={(e) => onUpdateQuestion(question.id, { caseSensitive: e.target.checked })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">Case sensitive</span>
                  </label>
                </div>
              </div>
            )}

            {/* Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                value={question.points}
                onChange={(e) => onUpdateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                min="1"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={question.explanation || ''}
                onChange={(e) => onUpdateQuestion(question.id, { explanation: e.target.value })}
                placeholder="Explain the correct answer..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
