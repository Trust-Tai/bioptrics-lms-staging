import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import type { Quiz, Question } from '../../../types/quiz.types';

export const QuizBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, moduleId, quizId } = useParams();
  
  // State management
  const [quiz, setQuiz] = useState<Quiz>({
    id: quizId || `quiz-${Date.now()}`,
    title: 'Quiz #1: Evaluation',
    description: '',
    moduleId: moduleId || '',
    questions: [],
    settings: {
      passingScore: 80,
      maxAttempts: 3,
      allowRetakes: true,
      shuffleQuestions: false,
      shuffleOptions: false,
      showCorrectAnswers: true,
      showScoreImmediately: true,
      requireCompletion: false
    },
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  
  const [activeTab, setActiveTab] = useState<'content' | 'outline'>('content');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [settingsTab, setSettingsTab] = useState<'content' | 'style'>('content');
  const [collapsedCategories, setCollapsedCategories] = useState<{ [key: string]: boolean }>({
    'Basic Questions': true
  });

  // Mock data for development
  useEffect(() => {
    if (quizId && quizId !== 'new') {
      // In real app, fetch quiz data from API
      console.log('Loading quiz:', quizId);
    }
  }, [quizId]);

  const handleBackToCourseBuilder = () => {
    navigate(`/content-library/builder/${courseId}`);
  };

  const toggleCategoryCollapse = (categoryName: string) => {
    setCollapsedCategories(prev => {
      const isCurrentlyCollapsed = prev[categoryName];
      
      if (isCurrentlyCollapsed) {
        // If clicking on a collapsed category, close all others and open this one
        return {
          'Basic Questions': true,
          [categoryName]: false
        };
      } else {
        // If clicking on an expanded category, just collapse it
        return {
          ...prev,
          [categoryName]: true
        };
      }
    });
  };

  const handleAddQuestion = (type: Question['type']) => {
    let newQuestion: Question;
    
    if (type === 'single-choice') {
      newQuestion = {
        id: `question-${Date.now()}`,
        type: 'single-choice',
        questionText: 'Enter your question here...',
        points: 1,
        options: [
          { id: 'opt-1', text: 'Option #1', isCorrect: false },
          { id: 'opt-2', text: 'Option #2', isCorrect: false }
        ]
      };
    } else if (type === 'multiple-choice') {
      newQuestion = {
        id: `question-${Date.now()}`,
        type: 'multiple-choice',
        questionText: 'Enter your question here...',
        points: 1,
        options: [
          { id: 'opt-1', text: 'Option #1', isCorrect: false },
          { id: 'opt-2', text: 'Option #2', isCorrect: false }
        ]
      };
    } else {
      newQuestion = {
        id: `question-${Date.now()}`,
        type: 'text-response',
        questionText: 'Enter your question here...',
        points: 1,
        answerType: 'short'
      };
    }

    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setSelectedQuestion(newQuestion);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(null);
    }
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<any>) => {
    setQuiz((prev: any) => ({
      ...prev,
      questions: prev.questions.map((q: any) => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
    
    // Update selected question if it's the one being updated
    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion((prev: any) => prev ? { ...prev, ...updates } : null);
    }
  };

  const questionBlockLibrary = [
    {
      category: 'Basic Questions',
      blocks: [
        { id: 'single-choice', name: 'Single Choice' },
        { id: 'multiple-choice', name: 'Multiple Choice' },
        { id: 'text-response', name: 'Text Response' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToCourseBuilder}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <button 
                onClick={handleBackToCourseBuilder}
                className="hover:text-gray-900"
              >
                Course Overview
              </button>
              <span>→</span>
              <button 
                onClick={handleBackToCourseBuilder}
                className="hover:text-gray-900"
              >
                Module #{moduleId}: Welcome and Overview
              </button>
              <span>→</span>
              <span className="text-gray-900 font-medium">{quiz.title}</span>
            </nav>
          </div>
          
          <Button variant="primary" className="bg-orange-500 hover:bg-orange-600">
            Publish
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              {/* Title */}
              <div className="flex items-center gap-3 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{quiz.title}</h1>
              </div>
              
              {/* Questions */}
              <div className="space-y-4">
                {quiz.questions.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Add Questions</h3>
                        <p className="text-gray-600 max-w-md">
                          Start building your quiz by adding questions from the sidebar.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  quiz.questions.map((question, index) => (
                    <div 
                      key={question.id} 
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedQuestion(question)}
                    >
                      {/* Question Header */}
                      <div className={`flex items-center justify-between p-4 text-white rounded-t-lg ${
                        question.type === 'single-choice' ? 'bg-blue-600' :
                        question.type === 'multiple-choice' ? 'bg-green-600' :
                        question.type === 'text-response' ? 'bg-purple-600' :
                        'bg-gray-600'
                      }`}>
                        <span className="font-medium text-sm">
                          {question.type === 'single-choice' && 'SINGLE CHOICE'}
                          {question.type === 'multiple-choice' && 'MULTIPLE CHOICE'}
                          {question.type === 'text-response' && 'TEXT RESPONSE'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuestion(question);
                            }}
                            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                            title="Edit question"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}
                            className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                            title="Delete question"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="p-6">
                        {/* Question Text */}
                        <div className="mb-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {question.questionText || 'Enter your question here...'}
                          </h3>
                        </div>

                        {/* Question Image */}
                        <div className="mb-6">
                          {question.imageUrl ? (
                            <div className="relative">
                              <img 
                                src={question.imageUrl} 
                                alt="Question" 
                                className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                              />
                            </div>
                          ) : (
                            <div className="w-full max-w-md h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-xs text-gray-500">No image</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Options for Single/Multiple Choice */}
                        {(question.type === 'single-choice' || question.type === 'multiple-choice') && question.options && (
                          <div className="space-y-3">
                            {question.options.map((option, optIndex) => (
                              <div 
                                key={option.id} 
                                className={`p-4 rounded-lg border-2 transition-colors ${
                                  option.isCorrect 
                                    ? 'bg-yellow-50 border-yellow-300 text-gray-900' 
                                    : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    question.type === 'single-choice' ? 'rounded-full' : 'rounded-md'
                                  } ${
                                    option.isCorrect 
                                      ? 'bg-yellow-400 border-yellow-500' 
                                      : 'bg-white border-gray-300'
                                  }`}>
                                    {option.isCorrect && (
                                      <div className={`w-2 h-2 bg-white ${
                                        question.type === 'single-choice' ? 'rounded-full' : 'rounded-sm'
                                      }`}></div>
                                    )}
                                  </div>
                                  <span className="font-medium">
                                    Option #{optIndex + 1}
                                  </span>
                                </div>
                                <div className="mt-2 ml-8">
                                  <p className="text-sm">{option.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Text Response */}
                        {question.type === 'text-response' && (
                          <div className="p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="text-gray-500 text-sm italic">Text response area</p>
                          </div>
                        )}

                        {/* Question Footer */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                          <span>Question {index + 1}</span>
                          <span>{question.points} point{question.points !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center Sidebar - Question Types (hidden when settings panel is open) */}
        {!selectedQuestion && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button 
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === 'content' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Content
                  </button>
                  <button 
                    onClick={() => setActiveTab('outline')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === 'outline' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Outline
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'content' && (
                  <div>
                    {questionBlockLibrary.map((category) => {
                      const isCollapsed = collapsedCategories[category.category];
                      return (
                        <div key={category.category} className="mb-4">
                          <button
                            onClick={() => toggleCategoryCollapse(category.category)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                ❓ {category.category}
                              </span>
                            </div>
                            <svg 
                              className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {!isCollapsed && (
                            <div className="mt-3 pl-3">
                              <div className="grid grid-cols-2 gap-2">
                                {category.blocks.map((block) => (
                                  <button
                                    key={block.id}
                                    onClick={() => handleAddQuestion(block.id as Question['type'])}
                                    className="p-3 text-xs text-center border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                  >
                                    {block.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeTab === 'outline' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Outline</h3>
                    <div className="space-y-2">
                      {quiz.questions.map((question, index) => (
                        <div key={question.id} className="p-2 bg-gray-50 rounded text-sm">
                          {index + 1}. {question.questionText || 'Untitled Question'}
                        </div>
                      ))}
                      {quiz.questions.length === 0 && (
                        <p className="text-gray-500 text-sm italic">No questions added yet</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Right Sidebar - Question Settings */}
        {selectedQuestion && (
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full shadow-lg">
            {/* Header with Back Button */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm font-medium">Back to elements</span>
                </button>
              </div>
              
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Question Settings</h3>
                <p className="text-sm text-gray-500">Configure your question properties</p>
              </div>
              
              <div className="flex border-b border-gray-200">
                <button 
                  onClick={() => setSettingsTab('content')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    settingsTab === 'content' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Content
                </button>
                <button 
                  onClick={() => setSettingsTab('style')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    settingsTab === 'style' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Style
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {settingsTab === 'content' ? (
                <div className="space-y-6">
                  {/* Question Text */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Question Text
                    </label>
                    <textarea
                      value={selectedQuestion.questionText}
                      onChange={(e) => handleUpdateQuestion(selectedQuestion.id, { questionText: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                      rows={4}
                      placeholder="Enter your question here..."
                    />
                  </div>

                  {/* Question Image Upload */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Question Image (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="question-image-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const imageUrl = URL.createObjectURL(file);
                            handleUpdateQuestion(selectedQuestion.id, { imageUrl });
                          }
                        }}
                      />
                      <label htmlFor="question-image-upload" className="cursor-pointer">
                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">Click to upload image</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </label>
                    </div>
                    {selectedQuestion.imageUrl && (
                      <div className="mt-4">
                        <img src={selectedQuestion.imageUrl} alt="Question" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
                        <button
                          onClick={() => handleUpdateQuestion(selectedQuestion.id, { imageUrl: undefined })}
                          className="mt-2 px-3 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Remove image
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Options for Single/Multiple Choice */}
                  {(selectedQuestion.type === 'single-choice' || selectedQuestion.type === 'multiple-choice') && 'options' in selectedQuestion && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Answer Options
                      </label>
                      <div className="space-y-3">
                        {selectedQuestion.options?.map((option, index) => (
                          <div key={option.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <input
                              type={selectedQuestion.type === 'single-choice' ? 'radio' : 'checkbox'}
                              name={`question-${selectedQuestion.id}`}
                              checked={option.isCorrect}
                              onChange={(e) => {
                                if ('options' in selectedQuestion) {
                                  const updatedOptions = selectedQuestion.options?.map((opt, optIndex) => {
                                    if (selectedQuestion.type === 'single-choice') {
                                      return { ...opt, isCorrect: optIndex === index };
                                    } else {
                                      return optIndex === index ? { ...opt, isCorrect: e.target.checked } : opt;
                                    }
                                  });
                                  handleUpdateQuestion(selectedQuestion.id, { options: updatedOptions });
                                }
                              }}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => {
                                if ('options' in selectedQuestion) {
                                  const updatedOptions = selectedQuestion.options?.map((opt, optIndex) =>
                                    optIndex === index ? { ...opt, text: e.target.value } : opt
                                  );
                                  handleUpdateQuestion(selectedQuestion.id, { options: updatedOptions });
                                }
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder={`Option ${index + 1}`}
                            />
                            <button
                              onClick={() => {
                                if ('options' in selectedQuestion) {
                                  const updatedOptions = selectedQuestion.options?.filter((_, optIndex) => optIndex !== index);
                                  handleUpdateQuestion(selectedQuestion.id, { options: updatedOptions });
                                }
                              }}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            if ('options' in selectedQuestion) {
                              const newOption = {
                                id: `opt-${Date.now()}`,
                                text: `Option ${(selectedQuestion.options?.length || 0) + 1}`,
                                isCorrect: false
                              };
                              const updatedOptions = [...(selectedQuestion.options || []), newOption];
                              handleUpdateQuestion(selectedQuestion.id, { options: updatedOptions });
                            }
                          }}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Points and Explanation */}
                  <div className="grid grid-cols-1 gap-6">
                    {/* Points */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Points
                      </label>
                      <input
                        type="number"
                        value={selectedQuestion.points}
                        onChange={(e) => handleUpdateQuestion(selectedQuestion.id, { points: parseInt(e.target.value) || 1 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="100"
                        placeholder="Enter points (1-100)"
                      />
                      <p className="text-xs text-gray-500 mt-2">How many points is this question worth?</p>
                    </div>

                    {/* Explanation */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Explanation (Optional)
                      </label>
                      <textarea
                        value={selectedQuestion.explanation || ''}
                        onChange={(e) => handleUpdateQuestion(selectedQuestion.id, { explanation: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                        rows={4}
                        placeholder="Explain why this is the correct answer..."
                      />
                      <p className="text-xs text-gray-500 mt-2">This will be shown to students after they answer</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Style Settings</h3>
                    <p className="text-sm text-gray-500">Customize the appearance and styling of your question</p>
                    <div className="mt-4 text-xs text-gray-400">Coming soon...</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
