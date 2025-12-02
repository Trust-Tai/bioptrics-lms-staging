import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronRight, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TopicCard } from '../../components/course-builder/TopicCard';
import { QuizCard } from '../../components/course-builder/QuizCard';
import type { CourseSetupFormData, ModuleData, QuizData } from '../../types/courseBuilder.types';

export const SplitScreenCourseBuilder: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CourseSetupFormData>({
    title: '',
    topic: '',
    description: '',
    learnerAudience: 'All Levels',
    estimatedHours: 0,
    estimatedMinutes: 0,
    learningObjectives: ['']
  });

  const [modules, setModules] = useState<ModuleData[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['1']));
  const [selectedTab, setSelectedTab] = useState<Record<string, 'goals' | 'contents'>>({});

  // Initialize with default modules
  useEffect(() => {
    const getModuleTitle = (index: number, topic: string) => {
      if (index === 0) return 'Welcome and Overview';
      
      // Generate contextual module titles based on course topic
      const topicLower = topic.toLowerCase();
      if (topicLower.includes('onboard') || topicLower.includes('employee')) {
        const titles = ['Company Values and Culture', 'Leadership and Expectations', 'Policies and Procedures', 'Resources and Tools'];
        return titles[index - 1] || `Module ${index + 1}`;
      } else if (topicLower.includes('safety') || topicLower.includes('compliance')) {
        const titles = ['Safety Fundamentals', 'Risk Assessment', 'Emergency Procedures', 'Compliance Requirements'];
        return titles[index - 1] || `Module ${index + 1}`;
      } else if (topicLower.includes('sales') || topicLower.includes('marketing')) {
        const titles = ['Sales Fundamentals', 'Customer Engagement', 'Product Knowledge', 'Closing Techniques'];
        return titles[index - 1] || `Module ${index + 1}`;
      } else {
        // Default generic titles
        const titles = ['Core Concepts', 'Advanced Topics', 'Practical Applications', 'Assessment and Review'];
        return titles[index - 1] || `Module ${index + 1}`;
      }
    };

    // Initialize with 2 default modules if modules array is empty
    if (modules.length === 0) {
      const initialModules: ModuleData[] = Array.from({ length: 2 }, (_, index) => ({
        id: `${index + 1}`,
        title: getModuleTitle(index, formData.topic),
        courseId: 'new-course',
        order: index + 1,
        estimatedMinutes: 70,
        goals: index === 0 ? 'This module provides an introduction to the course and sets the foundation for what participants will learn. It covers the course structure, goals, and what to expect throughout the program.' : '',
        learningObjectives: index === 0 ? [
          { id: '1.1', text: 'Understand the course structure and learning path', order: 1 },
          { id: '1.2', text: 'Identify key goals and expected outcomes of the program', order: 2 },
          { id: '1.3', text: 'Navigate the learning platform and available resources', order: 3 }
        ] : [],
        topics: index === 0 ? [
          {
            id: 'topic-1-1',
            title: 'Topic #1: Introduction',
            description: '',
            moduleId: '1',
            order: 1,
            contentBlocks: [],
            status: 'draft' as const
          },
          {
            id: 'topic-1-2',
            title: 'Topic #2: Introduction',
            description: '',
            moduleId: '1',
            order: 2,
            contentBlocks: [],
            status: 'draft' as const
          }
        ] : [],
        quizzes: [],
        status: 'draft'
      }));
      
      setModules(initialModules);
      
      // Set default tabs - all modules default to Contents tab
      const defaultTabs: Record<string, 'goals' | 'contents'> = {};
      initialModules.forEach(module => {
        defaultTabs[module.id] = 'contents';
      });
      setSelectedTab(defaultTabs);
    } else {
      // Update existing module titles when topic changes
      const updatedModules = modules.map((module, index) => ({
        ...module,
        title: getModuleTitle(index, formData.topic)
      }));
      setModules(updatedModules);
    }
  }, [formData.topic]);

  const handleInputChange = (field: keyof CourseSetupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleRemoveObjective = (index: number) => {
    if (formData.learningObjectives.length > 1) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
      }));
    }
  };

  const handleObjectiveChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => 
        i === index ? value : obj
      )
    }));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const collapseAll = () => {
    setExpandedModules(new Set());
  };

  const setModuleTab = (moduleId: string, tab: 'goals' | 'contents') => {
    setSelectedTab(prev => ({
      ...prev,
      [moduleId]: tab
    }));
  };

  const handleAddModule = () => {
    const newModuleId = `${modules.length + 1}`;
    const newModule: ModuleData = {
      id: newModuleId,
      title: `Module ${modules.length + 1}`,
      courseId: 'new-course',
      order: modules.length + 1,
      estimatedMinutes: 70,
      goals: '',
      learningObjectives: [],
      topics: [],
      quizzes: [],
      status: 'draft'
    };
    
    setModules(prev => [...prev, newModule]);
    setSelectedTab(prev => ({
      ...prev,
      [newModuleId]: 'contents'
    }));
  };

  const handleAddTopic = (moduleId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const topicNumber = module.topics.length + 1;
        const newTopic = {
          id: `topic-${moduleId}-${topicNumber}`,
          title: `Topic #${topicNumber}: Introduction`,
          description: '',
          moduleId: moduleId,
          order: topicNumber,
          contentBlocks: [],
          status: 'draft' as const
        };
        
        return {
          ...module,
          topics: [...module.topics, newTopic]
        };
      }
      return module;
    }));
  };

  const handleAddQuiz = (moduleId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const quizNumber = module.quizzes.length + 1;
        const newQuiz: QuizData = {
          id: `quiz-${moduleId}-${quizNumber}`,
          title: `Quiz #${quizNumber}: Evaluation`,
          description: '',
          moduleId: moduleId,
          order: quizNumber,
          questions: [],
          settings: {
            timeLimit: 30,
            passingScore: 80,
            maxAttempts: 3,
            allowRetakes: true,
            shuffleQuestions: false,
            shuffleOptions: false,
            showCorrectAnswers: true,
            showScoreImmediately: true,
            requireCompletion: false
          },
          status: 'draft'
        };
        
        return {
          ...module,
          quizzes: [...module.quizzes, newQuiz]
        };
      }
      return module;
    }));
  };

  const handleDeleteQuiz = (moduleId: string, quizId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          quizzes: module.quizzes.filter(quiz => quiz.id !== quizId)
        };
      }
      return module;
    }));
  };

  const handleAddLearningObjective = (moduleId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const objectiveNumber = module.learningObjectives.length + 1;
        const newObjective = {
          id: `${moduleId}-obj-${objectiveNumber}`,
          text: '',
          order: objectiveNumber
        };
        return {
          ...module,
          learningObjectives: [...module.learningObjectives, newObjective]
        };
      }
      return module;
    }));
  };

  const handleUpdateLearningObjective = (moduleId: string, objectiveId: string, text: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        return {
          ...module,
          learningObjectives: module.learningObjectives.map(obj => 
            obj.id === objectiveId ? { ...obj, text } : obj
          )
        };
      }
      return module;
    }));
  };

  const handleRemoveLearningObjective = (moduleId: string, objectiveId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const updatedObjectives = module.learningObjectives
          .filter(obj => obj.id !== objectiveId)
          .map((obj, index) => ({ ...obj, order: index + 1 }));
        return {
          ...module,
          learningObjectives: updatedObjectives
        };
      }
      return module;
    }));
  };

  const handleDeleteTopic = (moduleId: string, topicId: string) => {
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const updatedTopics = module.topics.filter(topic => topic.id !== topicId);
        // Reorder remaining topics
        const reorderedTopics = updatedTopics.map((topic, index) => ({
          ...topic,
          order: index + 1,
          title: topic.title.replace(/Topic #\d+:/, `Topic #${index + 1}:`)
        }));
        
        return {
          ...module,
          topics: reorderedTopics
        };
      }
      return module;
    }));
  };


  const getTotalLength = () => {
    const totalMinutes = modules.reduce((sum, module) => sum + module.estimatedMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/content-library')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-primary-600 text-white px-3 py-1 rounded-lg">
                <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-primary-600 text-xs font-bold">CB</span>
                </div>
                <span className="font-medium">Course Builder</span>
                <span className="text-xs bg-orange-500 px-1 rounded text-white">BETA</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="primary" 
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              Create Course
            </Button>
          </div>
        </div>
      </div>

      {/* Main Split Screen Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Course Setup Form */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Generate course outline</h2>
              </div>

              {/* Course Topic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="Enter course topic - e.g., 'Digital Marketing Fundamentals', 'Project Management Essentials', 'Data Analysis with Python'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Learning Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning objectives <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {formData.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <textarea
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        placeholder={`Learning objective ${index + 1} - e.g., "Students will be able to analyze and interpret complex data sets to make informed business decisions"`}
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                      />
                      {formData.learningObjectives.length > 1 && (
                        <button
                          onClick={() => handleRemoveObjective(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors mt-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Learner Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learner audience <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.learnerAudience || ''}
                  onChange={(e) => handleInputChange('learnerAudience', e.target.value)}
                  placeholder="Describe your target audience - e.g., 'New employees with 0-2 years of experience, managers transitioning to leadership roles, or professionals seeking to enhance their technical skills in data analysis'"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                />
              </div>

              {/* Course Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course length <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={23}
                    readOnly
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <span className="text-sm text-gray-600">Hours</span>
                </div>
              </div>


              {/* Upload Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload content you've already created
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Drop files here or click to upload</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Course Outline */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <div className="p-6">
            {/* Course Outline Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Course outline</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <button
                  onClick={collapseAll}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Collapse all
                </button>
                <span>✓ Saved</span>
                <span>Total length: {getTotalLength()}</span>
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-3">
              {modules.map((module) => (
                <div key={module.id} className="bg-white rounded-lg border border-gray-200">
                  {/* Module Header */}
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3 flex-1" onClick={() => toggleModule(module.id)}>
                      <button className="text-gray-400 hover:text-gray-600">
                        {expandedModules.has(module.id) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <span className="font-medium text-gray-900">
                        {module.order}. {module.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <path d="M8 12h8M12 8v8"/>
                        </svg>
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Module Content */}
                  {expandedModules.has(module.id) && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      {/* Contents/Goals Tabs */}
                      <div className="flex border-b border-gray-200 mb-4">
                        <button
                          className={`px-4 py-2 text-sm font-medium ${
                            selectedTab[module.id] === 'contents'
                              ? 'text-primary-600 border-b-2 border-primary-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          onClick={() => setModuleTab(module.id, 'contents')}
                        >
                          Contents
                        </button>
                        <button
                          className={`px-4 py-2 text-sm font-medium ${
                            selectedTab[module.id] === 'goals'
                              ? 'text-primary-600 border-b-2 border-primary-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          onClick={() => setModuleTab(module.id, 'goals')}
                        >
                          Goals
                        </button>
                      </div>

                      {/* Goals Tab Content */}
                      {selectedTab[module.id] === 'goals' && (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Approximate length of this module</p>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={module.estimatedMinutes}
                                className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                                readOnly
                              />
                              <span className="text-sm text-gray-600">Minutes</span>
                            </div>
                          </div>

                          {module.goals && (
                            <div>
                              <p className="text-sm text-gray-700">{module.goals}</p>
                            </div>
                          )}

                          {/* Learning Objectives Section */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-900">
                                Learning objectives ({module.learningObjectives.length})
                              </h4>
                              <button
                                onClick={() => handleAddLearningObjective(module.id)}
                                className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                <Plus size={14} />
                                Add learning objective
                              </button>
                            </div>

                            {module.learningObjectives.length > 0 ? (
                              <div className="space-y-3">
                                {module.learningObjectives.map((objective) => (
                                  <div key={objective.id} className="p-3 border border-gray-200 rounded-lg bg-white">
                                    <div className="flex items-start gap-2">
                                      <span className="text-sm text-gray-500 mt-2 font-medium min-w-[2rem]">
                                        {module.order}.{objective.order}
                                      </span>
                                      <div className="flex-1">
                                        <textarea
                                          value={objective.text}
                                          onChange={(e) => handleUpdateLearningObjective(module.id, objective.id, e.target.value)}
                                          placeholder={`Learning objective ${objective.order} - e.g., "Students will be able to understand the key concepts and apply them in practical scenarios"`}
                                          rows={2}
                                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-vertical"
                                        />
                                      </div>
                                      <button
                                        onClick={() => handleRemoveLearningObjective(module.id, objective.id)}
                                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors mt-1"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-sm text-gray-500 mb-2">No learning objectives yet</p>
                                <button
                                  onClick={() => handleAddLearningObjective(module.id)}
                                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                >
                                  Add your first learning objective
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Contents Tab Content */}
                      {selectedTab[module.id] === 'contents' && (
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-sm"
                              onClick={() => handleAddTopic(module.id)}
                            >
                              <Plus size={14} className="mr-1" />
                              New Topic
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-sm"
                              onClick={() => handleAddQuiz(module.id)}
                            >
                              ✓ New Quiz
                            </Button>
                            <Button size="sm" variant="outline" className="text-sm">
                              📄 New Case Study
                            </Button>
                          </div>
                          
                          {/* Topics and Quizzes List */}
                          {(module.topics && module.topics.length > 0) || (module.quizzes && module.quizzes.length > 0) ? (
                            <div className="space-y-2">
                              {/* Topics */}
                              {module.topics.map((topic) => (
                                <TopicCard
                                  key={topic.id}
                                  topic={topic}
                                  moduleId={module.id}
                                  courseId="new-course"
                                  onDelete={handleDeleteTopic}
                                />
                              ))}
                              
                              {/* Quizzes */}
                              {module.quizzes.map((quiz) => (
                                <QuizCard
                                  key={quiz.id}
                                  quiz={quiz}
                                  moduleId={module.id}
                                  courseId="new-course"
                                  onDelete={handleDeleteQuiz}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                              <p className="text-sm text-gray-500">
                                No content added yet. Click on the buttons above to add lessons or content to this module.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add Module Button */}
              <button
                onClick={handleAddModule}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span className="font-medium">Add Module</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
