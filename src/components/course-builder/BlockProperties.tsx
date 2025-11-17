import React, { useState } from 'react';
import type { Block } from '../../types/course.types';
import {
  ImageBlockEditor,
  VideoBlockEditor,
  ImageTextBlockEditor,
  AccordionBlockEditor,
  TabsBlockEditor,
  FlipCardBlockEditor,
} from './block-editors';

interface BlockPropertiesProps {
  block: Block | null;
  onUpdateBlock: (blockId: string, updates: Partial<Block>) => void;
}

export const BlockProperties: React.FC<BlockPropertiesProps> = ({ block, onUpdateBlock }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'animation'>('content');

  if (!block) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <p className="text-sm text-gray-500 text-center">Select a block to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Block Properties</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {(['content', 'style', 'animation'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block Title
            </label>
            <input
              type="text"
              value={block.title}
              onChange={(e) => onUpdateBlock(block.id, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Block Type
            </label>
            <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 capitalize">
              {block.type}
            </div>
          </div>

          {/* Block-Specific Editors */}
          {block.type === 'text' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Edit text content directly in the canvas editor on the left.
              </p>
            </div>
          )}
          
          {block.type === 'section' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={typeof block.content === 'string' ? block.content : (block.content?.description || '')}
                onChange={(e) => {
                  const newContent = {
                    ...(typeof block.content === 'object' ? block.content : {}),
                    description: e.target.value
                  };
                  onUpdateBlock(block.id, { content: newContent });
                }}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Section description..."
              />
            </div>
          )}

          {block.type === 'image' && (
            <ImageBlockEditor
              block={block}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
            />
          )}

          {block.type === 'video' && (
            <VideoBlockEditor
              block={block}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
            />
          )}

          {block.type === 'image-text' && (
            <ImageTextBlockEditor
              block={block}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
            />
          )}

          {block.type === 'accordion' && (
            <AccordionBlockEditor
              block={block}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
            />
          )}

          {block.type === 'tabs' && (
            <TabsBlockEditor
              block={block}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
            />
          )}

          {block.type === 'flip-card' && (
            <FlipCardBlockEditor
              block={block}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
            />
          )}
        </div>
      )}

      {/* Style Tab */}
      {activeTab === 'style' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Background Color
            </label>
            <input
              type="color"
              value={typeof block.content === 'object' ? (block.content?.backgroundColor || '#ffffff') : '#ffffff'}
              onChange={(e) => {
                const newContent = {
                  ...(typeof block.content === 'object' ? block.content : {}),
                  backgroundColor: e.target.value
                };
                onUpdateBlock(block.id, { content: newContent });
              }}
              className="w-full h-10 rounded border border-gray-300 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Padding
            </label>
            <input
              type="text"
              value={typeof block.content === 'object' ? (block.content?.padding || '1rem') : '1rem'}
              onChange={(e) => {
                const newContent = {
                  ...(typeof block.content === 'object' ? block.content : {}),
                  padding: e.target.value
                };
                onUpdateBlock(block.id, { content: newContent });
              }}
              placeholder="1rem"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Border Radius
            </label>
            <input
              type="text"
              value={typeof block.content === 'object' ? (block.content?.borderRadius || '0.5rem') : '0.5rem'}
              onChange={(e) => {
                const newContent = {
                  ...(typeof block.content === 'object' ? block.content : {}),
                  borderRadius: e.target.value
                };
                onUpdateBlock(block.id, { content: newContent });
              }}
              placeholder="0.5rem"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              These styles will be applied when the block is rendered in the course.
            </p>
          </div>
        </div>
      )}

      {/* Animation Tab */}
      {activeTab === 'animation' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Animation Type
            </label>
            <select
              value={block.content?.animationType || 'None'}
              onChange={(e) => {
                const newContent = {
                  ...(block.content || {}),
                  animationType: e.target.value
                };
                onUpdateBlock(block.id, { content: newContent });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="None">None</option>
              <option value="Fade In">Fade In</option>
              <option value="Slide In Right">Slide In Right</option>
              <option value="Slide In Left">Slide In Left</option>
              <option value="Scale In">Scale In</option>
              <option value="Bounce">Bounce</option>
            </select>
          </div>

          {block.content?.animationType && block.content.animationType !== 'None' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={block.content?.animationDuration || 0.5}
                  onChange={(e) => {
                    const newContent = {
                      ...(block.content || {}),
                      animationDuration: parseFloat(e.target.value)
                    };
                    onUpdateBlock(block.id, { content: newContent });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay (seconds)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={block.content?.animationDelay || 0}
                  onChange={(e) => {
                    const newContent = {
                      ...(block.content || {}),
                      animationDelay: parseFloat(e.target.value)
                    };
                    onUpdateBlock(block.id, { content: newContent });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-primary-600">
                  Preview animation when learners view this block
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
