import React from 'react';
import { 
  LayoutGrid, Type, Heading, Image, Columns, Video, 
  ChevronDown, FlipHorizontal, HelpCircle, FileText, 
  Link, CheckSquare, Award, Code, Layers
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BlockLibraryItem } from '../../types/course.types';

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid, Type, Heading, Image, Columns, Video,
  ChevronDown, Tabs: Layers, FlipHorizontal, HelpCircle, FileText,
  Link, CheckSquare, Award, Code
};

interface BlockLibraryProps {
  blocks: BlockLibraryItem[];
  onSelectBlock: (blockType: string) => void;
}

export const BlockLibrary: React.FC<BlockLibraryProps> = ({ blocks, onSelectBlock }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Block Library</h2>
      </div>

      <div className="p-4 space-y-2">
        {blocks.map((block) => {
          const Icon = iconMap[block.icon] || Type;
          return (
            <button
              key={block.type}
              onClick={() => onSelectBlock(block.type)}
              className="w-full flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-left group"
            >
              <div className="p-2 bg-gray-100 rounded group-hover:bg-primary-100 transition-colors">
                <Icon size={18} className="text-gray-600 group-hover:text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{block.label}</h3>
                <p className="text-xs text-gray-500">{block.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
