import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import type { CourseSetupFormData } from '../../types/courseBuilder.types';

export const CourseSetup: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<CourseSetupFormData>({
    title: '',
    topic: '',
    description: '',
    learnerAudience: 'All Levels',
    estimatedHours: 0,
    estimatedMinutes: 0,
    learningObjectives: ['']
  });

  const handleInputChange = (field: keyof CourseSetupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
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

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // TODO: API call to save course setup
      console.log('Saving course setup:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to course builder with new course ID
      const courseId = `course-${Date.now()}`;
      navigate(`/content-library/builder/${courseId}`);
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.topic.trim() && 
           formData.description.trim() &&
           formData.learningObjectives.some(obj => obj.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/content-library')}
              className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500 rounded-lg">
                <BookOpen size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Course Builder</h1>
                <p className="text-sm text-primary-200">BETA</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="secondary"
            onClick={handleSave}
            disabled={!isFormValid() || isSaving}
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            {isSaving ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Generate course outline</h2>
              <p className="text-sm text-gray-600 mt-1">Set up your course details and learning objectives</p>
            </div>

          <div className="p-6 space-y-6">
            {/* Course Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Topic <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="Enter course topic..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Course Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter course title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Learning Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning objectives <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder="Enter learning objective..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {formData.learningObjectives.length > 1 && (
                      <button
                        onClick={() => handleRemoveObjective(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={handleAddObjective}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus size={16} />
                  Add learning objective
                </button>
              </div>
            </div>

            {/* Learner Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learner audience <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.learnerAudience}
                onChange={(e) => handleInputChange('learnerAudience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="All Levels">All Levels</option>
                <option value="Beginners">Beginners</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Course Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course length <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.estimatedHours}
                    onChange={(e) => handleInputChange('estimatedHours', parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="text-sm text-gray-600">Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formData.estimatedMinutes}
                    onChange={(e) => handleInputChange('estimatedMinutes', parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <span className="text-sm text-gray-600">Minutes</span>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this course covers..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
