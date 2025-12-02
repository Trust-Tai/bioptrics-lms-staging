import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const TopicEditor: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId, topicId } = useParams();
  const loading = false;

  // Simple mock data for now
  const topic = {
    id: topicId || 'topic-1-1',
    title: 'Topic #1: Introduction',
    description: '',
    moduleId: moduleId || '1',
    order: 1,
    contentBlocks: [],
    status: 'draft' as const
  };

  const currentModule = {
    id: moduleId || '1',
    title: 'Welcome and Overview',
    order: 1
  };

  const handleBackToCourseBuilder = () => {
    navigate('/content-library/builder/new');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

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
                Module #{currentModule?.order}: {currentModule?.title}
              </button>
              <span>→</span>
              <span className="text-gray-900 font-medium">{topic?.title}</span>
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
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{topic.title}</h1>
              </div>

              {/* Content Blocks */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus size={24} className="text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Add Content</h3>
                      <p className="text-gray-600 max-w-md">
                        Start building your topic by adding content blocks from the sidebar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <button className="px-4 py-2 text-sm font-medium border-b-2 border-primary-500 text-primary-600">
                  Content
                </button>
                <button className="px-4 py-2 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900">
                  Outline
                </button>
              </div>

              {/* Content Block Library */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Blocks</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">Text & Images</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                      Text Container
                    </button>
                    <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors">
                      Image Block
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};