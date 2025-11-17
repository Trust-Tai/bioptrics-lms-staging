import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BlockLibrary } from '../../components/course-builder/BlockLibrary';
import { BuilderCanvas } from '../../components/course-builder/BuilderCanvas';
import { BlockProperties } from '../../components/course-builder/BlockProperties';
import { blockLibrary } from '../../data/courseData';
import type { Block } from '../../types/course.types';

export const CourseBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseTitle, setCourseTitle] = useState('Untitled Course');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null;

  const handleAddBlock = (blockType: string) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: blockType as any,
      title: blockType === 'section' ? 'New Section' : 'Text Content',
      order: blocks.length + 1,
      content: blockType === 'section' 
        ? { description: 'Section container - click to edit' }
        : '',
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    ));
  };

  const handleReorderBlocks = (reorderedBlocks: Block[]) => {
    setBlocks(reorderedBlocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(undefined);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handlePublish = () => {
    // Navigate to publish flow
    console.log('Publishing course...');
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/content-library')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="text-xl font-semibold text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2"
            />
            <Badge variant="default">draft</Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Saved 6:24:58 PM</span>
          <Button variant="ghost" size="sm">
            <Eye size={16} className="mr-2" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={16} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="primary" size="sm" onClick={handlePublish}>
            Publish to Marketplace
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Block Library */}
        <BlockLibrary blocks={blockLibrary} onSelectBlock={handleAddBlock} />

        {/* Canvas */}
        <BuilderCanvas
          blocks={blocks}
          onSelectBlock={setSelectedBlockId}
          onReorderBlocks={handleReorderBlocks}
          onUpdateBlock={handleUpdateBlock}
          onDeleteBlock={handleDeleteBlock}
          selectedBlockId={selectedBlockId}
        />

        {/* Properties Panel */}
        <BlockProperties
          block={selectedBlock}
          onUpdateBlock={handleUpdateBlock}
        />
      </div>
    </div>
  );
};
