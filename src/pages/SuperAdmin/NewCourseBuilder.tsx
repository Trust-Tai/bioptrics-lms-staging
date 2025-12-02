import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, ChevronDown, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import type { CourseSetup, ModuleData } from '../../types/courseBuilder.types';

export const NewCourseBuilder: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<CourseSetup | null>(null);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [selectedView, setSelectedView] = useState<'outline' | 'content'>('outline');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    const loadCourse = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        const mockCourse: CourseSetup = {
          id: courseId,
          title: 'Employee Onboarding Program',
          topic: 'Human Resources and Workplace Integration',
          description: 'Comprehensive onboarding program for new employees',
          learningObjectives: [
            { id: '1', text: 'Understand company culture and values', order: 1 },
            { id: '2', text: 'Navigate workplace policies and procedures', order: 2 },
            { id: '3', text: 'Complete required compliance training', order: 3 }
          ],
          learnerAudience: 'All Levels',
          estimatedHours: 6,
          estimatedMinutes: 50,
          numberOfModules: 5,
          status: 'draft'
        };

        const mockModules: ModuleData[] = [
          {
            id: '1',
            title: 'Welcome and Overview',
            courseId: courseId || '',
            order: 1,
            estimatedMinutes: 70,
            goals: 'This module provides an introduction to the course and sets the foundation for what participants will learn.',
            learningObjectives: [
              { id: '1.1', text: 'Understand the course structure and learning path', order: 1 },
              { id: '1.2', text: 'Identify key goals and expected outcomes of the program', order: 2 },
              { id: '1.3', text: 'Navigate the learning platform and available resources', order: 3 }
            ],
            topics: [],
            quizzes: [],
            status: 'draft'
          },
          {
            id: '2',
            title: 'Company Values and Culture',
            courseId: courseId || '',
            order: 2,
            estimatedMinutes: 90,
            goals: 'Learn about our company culture, values, and what makes our workplace unique.',
            learningObjectives: [
              { id: '2.1', text: 'Understand core company values', order: 1 },
              { id: '2.2', text: 'Learn about company history and mission', order: 2 }
            ],
            topics: [],
            quizzes: [],
            status: 'draft'
          },
          {
            id: '3',
            title: 'Leadership and Expectations',
            courseId: courseId || '',
            order: 3,
            estimatedMinutes: 85,
            goals: 'Understanding leadership structure and performance expectations.',
            learningObjectives: [],
            topics: [],
            quizzes: [],
            status: 'draft'
          },
          {
            id: '4',
            title: 'Policies and Procedures',
            courseId: courseId || '',
            order: 4,
            estimatedMinutes: 95,
            goals: 'Essential workplace policies and procedures every employee must know.',
            learningObjectives: [],
            topics: [],
            quizzes: [],
            status: 'draft'
          },
          {
            id: '5',
            title: 'Resources and Tools',
            courseId: courseId || '',
            order: 5,
            estimatedMinutes: 80,
            goals: 'Available resources, tools, and support systems for employees.',
            learningObjectives: [],
            topics: [],
            quizzes: [],
            status: 'draft'
          }
        ];

        setCourse(mockCourse);
        setModules(mockModules);
        
        // Expand first module by default
        setExpandedModules(new Set(['1']));
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: API call to save course
      console.log('Saving course...', { course, modules });
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddModule = () => {
    const newModule: ModuleData = {
      id: `module-${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      courseId: courseId || '',
      order: modules.length + 1,
      estimatedMinutes: 60,
      goals: '',
      learningObjectives: [],
      topics: [],
      quizzes: [],
      status: 'draft'
    };
    setModules([...modules, newModule]);
  };

  const getTotalLength = () => {
    const totalMinutes = modules.reduce((sum, module) => sum + module.estimatedMinutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
          <Button onClick={() => navigate('/content-library')} className="mt-4">
            Back to Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/content-library')}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium text-gray-900">{course.title}</h1>
              <Badge variant="default" className="text-xs">draft</Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Saved 6:24:58 PM</span>
            <Button variant="ghost" size="sm" className="text-sm">
              <Eye size={14} className="mr-1" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
              disabled={isSaving}
              className="text-sm"
            >
              {isSaving ? 'Saving...' : 'Save Course'}
            </Button>
            <Button variant="primary" size="sm" className="text-sm bg-teal-600 hover:bg-teal-700">
              Publish
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Course Outline Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Course outline</h2>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <button
                  onClick={collapseAll}
                  className="text-primary-600 hover:text-primary-700"
                >
                  Collapse all
                </button>
                <div className="flex items-center gap-1">
                  <Save size={12} />
                  <span>Saved</span>
                </div>
                <span>Total length: {getTotalLength()}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3 flex-1" onClick={() => toggleModule(module.id)}>
                      <button className="text-gray-400 hover:text-gray-600">
                        {expandedModules.has(module.id) ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {module.order}. {module.title}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {expandedModules.has(module.id) && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-3">
                        <div className="flex border-b border-gray-200">
                          <button
                            className={`px-3 py-2 text-sm font-medium ${
                              selectedView === 'outline'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            onClick={() => setSelectedView('outline')}
                          >
                            Goals
                          </button>
                          <button
                            className={`px-3 py-2 text-sm font-medium ${
                              selectedView === 'content'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            onClick={() => setSelectedView('content')}
                          >
                            Contents
                          </button>
                        </div>

                        {selectedView === 'outline' && (
                          <div className="space-y-3">
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

                            <div>
                              <p className="text-sm text-gray-600 mb-2">{module.goals}</p>
                            </div>

                            {module.learningObjectives.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">
                                  Learning objectives ({module.learningObjectives.length})
                                </h4>
                                <div className="space-y-2">
                                  {module.learningObjectives.map((objective) => (
                                    <div key={objective.id} className="flex items-start gap-2">
                                      <span className="text-sm text-gray-500 mt-0.5">
                                        {module.order}.{objective.order}
                                      </span>
                                      <p className="text-sm text-gray-700 flex-1">{objective.text}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedView === 'content' && (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Plus size={14} className="mr-1" />
                                New Topic
                              </Button>
                              <Button size="sm" variant="outline">
                                New Quiz
                              </Button>
                              <Button size="sm" variant="outline">
                                New Case Study
                              </Button>
                            </div>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <p className="text-sm text-gray-500">
                                No content added yet. Click on the buttons above to add lessons or content to this module.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddModule}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition-colors"
              >
                <Plus size={16} className="inline mr-2" />
                Add Module
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-gray-300">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
                <line x1="9" y1="9" x2="15" y2="9" strokeWidth="1.5"/>
                <line x1="9" y1="15" x2="15" y2="15" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Select a module to edit</h3>
            <p className="text-gray-600">Choose a module from the outline to start adding content.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
