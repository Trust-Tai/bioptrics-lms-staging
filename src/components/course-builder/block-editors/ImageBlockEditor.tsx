import React, { useRef } from 'react';
import { Upload, Link as LinkIcon, X } from 'lucide-react';
import type { Block } from '../../../types/course.types';

interface ImageBlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({ block, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const content = typeof block.content === 'object' ? block.content : {};

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to server and get URL
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Upload Image
                </button>
                <button
                  onClick={handleUrlInput}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <LinkIcon size={16} />
                  Add from URL
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
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
          Alt Text
        </label>
        <input
          type="text"
          value={content.alt || ''}
          onChange={(e) => onUpdate({
            content: { ...content, alt: e.target.value }
          })}
          placeholder="Describe the image..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => onUpdate({
            content: { ...content, caption: e.target.value }
          })}
          placeholder="Image caption (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link URL (optional)
        </label>
        <input
          type="url"
          value={content.linkUrl || ''}
          onChange={(e) => onUpdate({
            content: { ...content, linkUrl: e.target.value }
          })}
          placeholder="https://example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );
};
