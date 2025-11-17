import React, { useRef } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import { RichTextEditor } from '../RichTextEditor';
import type { Block } from '../../../types/course.types';

interface ImageTextBlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const ImageTextBlockEditor: React.FC<ImageTextBlockEditorProps> = ({ block, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const content = typeof block.content === 'object' ? block.content : {};

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          content: {
            ...content,
            imageUrl: reader.result as string,
            fileName: file.name,
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      onUpdate({
        content: {
          ...content,
          imageUrl: url,
        }
      });
    }
  };

  const handleRemoveImage = () => {
    onUpdate({
      content: {
        ...content,
        imageUrl: undefined,
        fileName: undefined,
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layout
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ content: { ...content, layout: 'image-left' } })}
            className={`flex-1 px-4 py-2 border rounded-lg ${
              content.layout === 'image-left' || !content.layout
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Image Left
          </button>
          <button
            onClick={() => onUpdate({ content: { ...content, layout: 'image-right' } })}
            className={`flex-1 px-4 py-2 border rounded-lg ${
              content.layout === 'image-right'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Image Right
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        
        {content.imageUrl ? (
          <div className="relative">
            <img 
              src={content.imageUrl} 
              alt={content.alt || 'Block image'} 
              className="w-full h-48 object-cover rounded-lg border border-gray-300"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <div className="mt-3 flex flex-col gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  Upload Image
                </button>
                <button
                  onClick={handleUrlInput}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <LinkIcon size={14} />
                  Add from URL
                </button>
              </div>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text Content
        </label>
        <RichTextEditor
          value={content.text || ''}
          onChange={(newText) => onUpdate({
            content: { ...content, text: newText }
          })}
          placeholder="Enter your text content..."
        />
      </div>
    </div>
  );
};
