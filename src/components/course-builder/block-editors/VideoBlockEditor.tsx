import React, { useRef } from 'react';
import { Upload, Link as LinkIcon, X, Youtube } from 'lucide-react';
import type { Block } from '../../../types/course.types';

interface VideoBlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const VideoBlockEditor: React.FC<VideoBlockEditorProps> = ({ block, onUpdate }) => {
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
            videoUrl: reader.result as string,
            fileName: file.name,
            videoType: 'upload',
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = () => {
    const url = prompt('Enter video URL (YouTube, Vimeo, or direct link):');
    if (url) {
      let videoType = 'url';
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        videoType = 'youtube';
      } else if (url.includes('vimeo.com')) {
        videoType = 'vimeo';
      }
      
      onUpdate({
        content: {
          ...content,
          videoUrl: url,
          videoType,
        }
      });
    }
  };

  const handleRemoveVideo = () => {
    onUpdate({
      content: {
        ...content,
        videoUrl: undefined,
        fileName: undefined,
        videoType: undefined,
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video
        </label>
        
        {content.videoUrl ? (
          <div className="relative">
            <div className="w-full h-48 bg-gray-900 rounded-lg border border-gray-300 flex items-center justify-center relative">
              {content.videoType === 'youtube' || content.videoType === 'vimeo' ? (
                <div className="text-center text-white">
                  <Youtube size={48} className="mx-auto mb-2" />
                  <p className="text-sm">Embedded Video</p>
                  <p className="text-xs text-gray-400 mt-1 px-4 break-all">{content.videoUrl}</p>
                </div>
              ) : (
                <video 
                  src={content.videoUrl} 
                  controls 
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
              <button
                onClick={handleRemoveVideo}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full"
                title="Remove video"
              >
                <X size={16} />
              </button>
            </div>
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
                  Upload Video
                </button>
                <button
                  onClick={handleUrlInput}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <LinkIcon size={16} />
                  Embed from URL
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                MP4, WebM or YouTube/Vimeo link
              </p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Title
        </label>
        <input
          type="text"
          value={content.videoTitle || ''}
          onChange={(e) => onUpdate({
            content: { ...content, videoTitle: e.target.value }
          })}
          placeholder="Enter video title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onUpdate({
            content: { ...content, description: e.target.value }
          })}
          rows={3}
          placeholder="Video description (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoplay"
          checked={content.autoplay || false}
          onChange={(e) => onUpdate({
            content: { ...content, autoplay: e.target.checked }
          })}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="autoplay" className="text-sm text-gray-700">
          Autoplay video
        </label>
      </div>
    </div>
  );
};
