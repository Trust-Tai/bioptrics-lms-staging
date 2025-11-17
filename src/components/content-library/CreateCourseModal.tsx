import React from 'react';
import { PlusCircle, LayoutTemplate } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFromScratch: () => void;
  onUseTemplate: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onStartFromScratch,
  onUseTemplate,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Course" size="lg">
      <p className="text-center text-gray-600 mb-8">Choose how you'd like to start</p>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Start from Scratch */}
        <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-primary-500 transition-all cursor-pointer group">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
              <PlusCircle size={32} className="text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Start from Scratch</h3>
            <p className="text-sm text-gray-600 mb-6">
              Build your course from the ground up with complete creative freedom. Add blocks, customize layouts, and create exactly what you envision.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span>✨ Fully customizable</span>
            </div>
            <Button 
              variant="primary" 
              size="md" 
              className="w-full"
              onClick={onStartFromScratch}
            >
              Start Building
            </Button>
          </div>
        </div>

        {/* Use a Template */}
        <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-primary-500 transition-all cursor-pointer group">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
              <LayoutTemplate size={32} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Use a Template</h3>
            <p className="text-sm text-gray-600 mb-6">
              Get started quickly with professionally designed templates. Choose from compliance, onboarding, microlearning, and more.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span>⚡ Quick start with best practices</span>
            </div>
            <Button 
              variant="primary" 
              size="md" 
              className="w-full"
              onClick={onUseTemplate}
            >
              Browse Templates
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
