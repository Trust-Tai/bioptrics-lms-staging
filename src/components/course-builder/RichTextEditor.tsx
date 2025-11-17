import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Image as ImageIcon, Type, Eye, Code } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Start writing your content...' 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [htmlCode, setHtmlCode] = useState(value);

  useEffect(() => {
    if (viewMode === 'visual' && editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
    if (viewMode === 'code') {
      setHtmlCode(value);
    }
  }, [value, viewMode]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlCode(newHtml);
    onChange(newHtml);
  };

  const toggleViewMode = () => {
    if (viewMode === 'visual') {
      // Switching to code view
      setHtmlCode(editorRef.current?.innerHTML || '');
      setViewMode('code');
    } else {
      // Switching to visual view
      setViewMode('visual');
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
    setShowFormatDropdown(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap flex-1">
          {/* Format Dropdown */}
          <div className="relative">
          <button
            type="button"
            onClick={() => setShowFormatDropdown(!showFormatDropdown)}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-2"
          >
            <Type size={16} />
            <span>Normal</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showFormatDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-[150px]">
              <button
                type="button"
                onClick={() => formatBlock('p')}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => formatBlock('h1')}
                className="w-full px-4 py-2 text-left text-lg font-bold hover:bg-gray-50"
              >
                Heading 1
              </button>
              <button
                type="button"
                onClick={() => formatBlock('h2')}
                className="w-full px-4 py-2 text-left text-base font-bold hover:bg-gray-50"
              >
                Heading 2
              </button>
              <button
                type="button"
                onClick={() => formatBlock('h3')}
                className="w-full px-4 py-2 text-left text-sm font-bold hover:bg-gray-50"
              >
                Heading 3
              </button>
            </div>
          )}
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Formatting */}
            <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Bold"
            disabled={viewMode === 'code'}
          >
            <Bold size={18} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Italic"
            disabled={viewMode === 'code'}
          >
            <Italic size={18} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Underline"
            disabled={viewMode === 'code'}
          >
            <Underline size={18} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('strikeThrough')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Strikethrough"
            disabled={viewMode === 'code'}
          >
            <Strikethrough size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Lists */}
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Bullet List"
            disabled={viewMode === 'code'}
          >
            <List size={18} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Numbered List"
            disabled={viewMode === 'code'}
          >
            <ListOrdered size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Alignment */}
          <button
            type="button"
            onClick={() => execCommand('justifyLeft')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Align Left"
            disabled={viewMode === 'code'}
          >
            <AlignLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyCenter')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Align Center"
            disabled={viewMode === 'code'}
          >
            <AlignCenter size={18} />
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyRight')}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Align Right"
            disabled={viewMode === 'code'}
          >
            <AlignRight size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Insert */}
          <button
            type="button"
            onClick={insertLink}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Insert Link"
            disabled={viewMode === 'code'}
          >
            <LinkIcon size={18} />
          </button>
          <button
            type="button"
            onClick={insertImage}
            className="p-1.5 hover:bg-gray-200 rounded"
            title="Insert Image"
            disabled={viewMode === 'code'}
          >
            <ImageIcon size={18} />
          </button>
        </div>

        {/* View/Code Toggle */}
        <div className="flex items-center gap-1 border-l border-gray-300 pl-2">
          <button
            type="button"
            onClick={toggleViewMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'visual' 
                ? 'bg-white text-gray-700 border border-gray-300' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            title="Visual Editor"
          >
            <Eye size={16} />
            <span>Visual</span>
          </button>
          <button
            type="button"
            onClick={toggleViewMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded transition-colors ${
              viewMode === 'code' 
                ? 'bg-white text-gray-700 border border-gray-300' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            title="HTML Code"
          >
            <Code size={16} />
            <span>Code</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      {viewMode === 'visual' ? (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          suppressContentEditableWarning
          className="min-h-[200px] p-4 focus:outline-none prose max-w-none"
          data-placeholder={placeholder}
          style={{
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={htmlCode}
          onChange={handleCodeChange}
          className="min-h-[200px] w-full p-4 font-mono text-sm focus:outline-none border-0 resize-none"
          placeholder="<p>Enter HTML code...</p>"
          spellCheck={false}
        />
      )}

      {/* Helper Text */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Use the toolbar to format your text, add links, and insert images.
        </p>
      </div>

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
          display: block;
        }
        [contenteditable]:focus {
          outline: none;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
        [contenteditable] a {
          color: #5a8596;
          text-decoration: underline;
        }
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        [contenteditable] li {
          margin: 0.5em 0;
        }
      `}</style>
    </div>
  );
};
