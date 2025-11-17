import React from 'react';
import type { Block } from '../../../types/course.types';

interface FlipCardBlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const FlipCardBlockEditor: React.FC<FlipCardBlockEditorProps> = ({ block, onUpdate }) => {
  const content = typeof block.content === 'object' ? block.content : {};

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Flip Direction
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ content: { ...content, flipDirection: 'horizontal' } })}
            className={`flex-1 px-4 py-2 border rounded-lg ${
              content.flipDirection === 'horizontal' || !content.flipDirection
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Horizontal
          </button>
          <button
            onClick={() => onUpdate({ content: { ...content, flipDirection: 'vertical' } })}
            className={`flex-1 px-4 py-2 border rounded-lg ${
              content.flipDirection === 'vertical'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Vertical
          </button>
        </div>
      </div>

      {/* Front Side */}
      <div className="border border-gray-300 rounded-lg p-4 bg-blue-50">
        <h4 className="font-medium text-gray-900 mb-3">Front Side</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={content.frontTitle || ''}
              onChange={(e) => onUpdate({
                content: { ...content, frontTitle: e.target.value }
              })}
              placeholder="Front title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content.frontContent || ''}
              onChange={(e) => onUpdate({
                content: { ...content, frontContent: e.target.value }
              })}
              rows={3}
              placeholder="Front content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={content.frontBgColor || '#3b82f6'}
              onChange={(e) => onUpdate({
                content: { ...content, frontBgColor: e.target.value }
              })}
              className="w-full h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div className="border border-gray-300 rounded-lg p-4 bg-green-50">
        <h4 className="font-medium text-gray-900 mb-3">Back Side</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={content.backTitle || ''}
              onChange={(e) => onUpdate({
                content: { ...content, backTitle: e.target.value }
              })}
              placeholder="Back title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content.backContent || ''}
              onChange={(e) => onUpdate({
                content: { ...content, backContent: e.target.value }
              })}
              rows={3}
              placeholder="Back content..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Background Color
            </label>
            <input
              type="color"
              value={content.backBgColor || '#10b981'}
              onChange={(e) => onUpdate({
                content: { ...content, backBgColor: e.target.value }
              })}
              className="w-full h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
