import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Block } from '../../../types/course.types';

interface TabItem {
  id: string;
  label: string;
  content: string;
}

interface TabsBlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

export const TabsBlockEditor: React.FC<TabsBlockEditorProps> = ({ block, onUpdate }) => {
  const content = typeof block.content === 'object' ? block.content : {};
  const tabs: TabItem[] = content.tabs || [];
  const activeTab = content.activeTab || 0;

  const addTab = () => {
    const newTab: TabItem = {
      id: `tab-${Date.now()}`,
      label: `Tab ${tabs.length + 1}`,
      content: 'Tab content...',
    };
    onUpdate({
      content: {
        ...content,
        tabs: [...tabs, newTab],
      }
    });
  };

  const updateTab = (id: string, updates: Partial<TabItem>) => {
    onUpdate({
      content: {
        ...content,
        tabs: tabs.map(tab => tab.id === id ? { ...tab, ...updates } : tab),
      }
    });
  };

  const deleteTab = (id: string) => {
    onUpdate({
      content: {
        ...content,
        tabs: tabs.filter(tab => tab.id !== id),
      }
    });
  };

  const setActiveTab = (index: number) => {
    onUpdate({
      content: {
        ...content,
        activeTab: index,
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Tabs
        </label>
        <button
          onClick={addTab}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus size={16} />
          Add Tab
        </button>
      </div>

      {tabs.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-sm text-gray-500">No tabs yet. Click "Add Tab" to get started.</p>
        </div>
      ) : (
        <>
          {/* Tab Headers */}
          <div className="flex gap-2 border-b border-gray-300">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === index
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Tab Content */}
          {tabs[activeTab] && (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <input
                  type="text"
                  value={tabs[activeTab].label}
                  onChange={(e) => updateTab(tabs[activeTab].id, { label: e.target.value })}
                  placeholder="Tab label..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                />
                <button
                  onClick={() => deleteTab(tabs[activeTab].id)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete tab"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <textarea
                value={tabs[activeTab].content}
                onChange={(e) => updateTab(tabs[activeTab].id, { content: e.target.value })}
                rows={6}
                placeholder="Tab content..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
