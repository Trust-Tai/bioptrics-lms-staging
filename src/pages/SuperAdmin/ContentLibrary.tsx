import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/Button';
import { CourseCard } from '../../components/content-library/CourseCard';
import { SearchBar } from '../../components/content-library/SearchBar';
import { CreateCourseModal } from '../../components/content-library/CreateCourseModal';
import { TemplateModal } from '../../components/content-library/TemplateModal';
import { coursesData, courseTemplates, templateCategories } from '../../data/courseData';

export const ContentLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const filteredCourses = coursesData.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCourse = (courseId: string) => {
    navigate(`/content-library/builder/${courseId}`);
  };

  const handleStartFromScratch = () => {
    setShowCreateModal(false);
    navigate('/content-library/builder/new');
  };

  const handleUseTemplate = () => {
    setShowCreateModal(false);
    setShowTemplateModal(true);
  };

  const handleSelectTemplate = (templateId: string) => {
    setShowTemplateModal(false);
    navigate(`/content-library/builder/new?template=${templateId}`);
  };

  const handleBackToCreate = () => {
    setShowTemplateModal(false);
    setShowCreateModal(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
            <p className="text-base text-gray-600 mt-1">Create and manage courses for the marketplace</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setShowCreateModal(true)}>
            + Create Course
          </Button>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search courses..."
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditCourse}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found matching your search.</p>
          </div>
        )}

        {/* Modals */}
        <CreateCourseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onStartFromScratch={handleStartFromScratch}
          onUseTemplate={handleUseTemplate}
        />

        <TemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onBack={handleBackToCreate}
          templates={courseTemplates}
          categories={templateCategories}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </DashboardLayout>
  );
};
