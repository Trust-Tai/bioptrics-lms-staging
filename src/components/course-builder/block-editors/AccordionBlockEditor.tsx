import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import type { Block } from '../../../types/course.types';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionBlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const AccordionBlockEditor: React.FC<AccordionBlockEditorProps> = ({ block, onUpdate }) => {
  const content = typeof block.content === 'object' ? block.content : {};
  const items: AccordionItem[] = content.items || [];

  const addItem = () => {
    const newItem: AccordionItem = {
      id: `item-${Date.now()}`,
      title: 'New Item',
      content: 'Item content...',
    };
    onUpdate({
      content: {
        ...content,
        items: [...items, newItem],
      }
    });
  };

  const updateItem = (id: string, updates: Partial<AccordionItem>) => {
    onUpdate({
      content: {
        ...content,
        items: items.map(item => item.id === id ? { ...item, ...updates } : item),
      }
    });
  };

  const deleteItem = (id: string) => {
    onUpdate({
      content: {
        ...content,
        items: items.filter(item => item.id !== id),
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Accordion Items
        </label>
        <button
          onClick={addItem}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-sm text-gray-500">No items yet. Click "Add Item" to get started.</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-2 mb-3">
                <GripVertical size={20} className="text-gray-400 mt-2 cursor-move" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                    placeholder="Item title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                  />
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <textarea
                value={item.content}
                onChange={(e) => updateItem(item.id, { content: e.target.value })}
                rows={3}
                placeholder="Item content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="allowMultiple"
          checked={content.allowMultiple || false}
          onChange={(e) => onUpdate({
            content: { ...content, allowMultiple: e.target.checked }
          })}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="allowMultiple" className="text-sm text-gray-700">
          Allow multiple items open at once
        </label>
      </div>
    </div>
  );
};
