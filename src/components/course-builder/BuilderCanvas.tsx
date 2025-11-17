import React, { useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { ConfirmModal } from '../ui/ConfirmModal';
import type { Block } from '../../types/course.types';

interface BuilderCanvasProps {
  blocks: Block[];
  onSelectBlock: (blockId: string) => void;
  onReorderBlocks: (blocks: Block[]) => void;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
  onDeleteBlock: (blockId: string) => void;
  selectedBlockId?: string;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({ 
  blocks, 
  onSelectBlock,
  onReorderBlocks,
  onUpdateBlock,
  onDeleteBlock,
  selectedBlockId 
}) => {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [deleteConfirmBlock, setDeleteConfirmBlock] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlockId(blockId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverBlockId(blockId);
  };

  const handleDragLeave = () => {
    setDragOverBlockId(null);
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    
    if (!draggedBlockId || draggedBlockId === targetBlockId) {
      setDraggedBlockId(null);
      setDragOverBlockId(null);
      return;
    }

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlockId);
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);

    // Update order property
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index + 1,
    }));

    onReorderBlocks(reorderedBlocks);
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDragOverBlockId(null);
  };

  const handleDeleteClick = (e: React.MouseEvent, blockId: string) => {
    e.stopPropagation();
    setDeleteConfirmBlock(blockId);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmBlock) {
      onDeleteBlock(deleteConfirmBlock);
      setDeleteConfirmBlock(null);
    }
  };
  if (blocks.length === 0) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-gray-400">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2"/>
              <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building</h3>
          <p className="text-sm text-gray-600">Add blocks from the library to create your course content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e, block.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, block.id)}
            onDragEnd={handleDragEnd}
            onClick={() => onSelectBlock(block.id)}
            onMouseEnter={() => setHoveredBlockId(block.id)}
            onMouseLeave={() => setHoveredBlockId(null)}
            className={`bg-white rounded-lg border-2 transition-all cursor-pointer relative ${
              selectedBlockId === block.id
                ? 'border-primary-500 shadow-lg'
                : dragOverBlockId === block.id
                ? 'border-primary-300 border-dashed'
                : 'border-gray-200 hover:border-gray-300'
            } ${draggedBlockId === block.id ? 'opacity-50' : ''}`}
            style={{
              backgroundColor: typeof block.content === 'object' ? block.content?.backgroundColor : undefined,
              padding: typeof block.content === 'object' ? block.content?.padding : undefined,
              borderRadius: typeof block.content === 'object' ? block.content?.borderRadius : undefined,
            }}
          >
            {/* Delete Button - Shows on Hover */}
            {hoveredBlockId === block.id && (
              <button
                onClick={(e) => handleDeleteClick(e, block.id)}
                className="absolute top-3 right-3 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors z-10"
                title="Delete block"
              >
                <Trash2 size={18} />
              </button>
            )}

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="cursor-move">
                  <GripVertical size={20} className="text-gray-400 hover:text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 uppercase">{block.type}</span>
                    <span className="text-sm text-gray-400">Block {block.order}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{block.title}</h3>
                </div>
              </div>

              {block.type === 'section' && (
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-sm text-gray-600">
                    {typeof block.content === 'string' 
                      ? block.content 
                      : (block.content?.description || 'Use sections to organize your course content into logical groups')}
                  </p>
                </div>
              )}

              {block.type === 'text' && (
                <>
                  {selectedBlockId === block.id ? (
                    <RichTextEditor
                      value={typeof block.content === 'string' 
                        ? block.content 
                        : (block.content?.text || '')}
                      onChange={(newText) => {
                        const newContent = typeof block.content === 'object'
                          ? { ...block.content, text: newText }
                          : newText;
                        onUpdateBlock(block.id, { content: newContent });
                      }}
                      placeholder="Start writing your content..."
                    />
                  ) : (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: typeof block.content === 'string' 
                          ? block.content 
                          : (block.content?.text || '<p class="text-gray-400">Click to edit...</p>')
                      }}
                    />
                  )}
                </>
              )}

              {block.type === 'image' && (
                <div className="bg-gray-100 rounded h-48 flex items-center justify-center">
                  <p className="text-gray-500">Click to configure this image block</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmBlock !== null}
        onClose={() => setDeleteConfirmBlock(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Block?"
        message="Are you sure you want to delete this block? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};
