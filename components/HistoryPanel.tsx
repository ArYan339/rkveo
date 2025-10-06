
import React from 'react';
import { HistoryItem as HistoryItemType } from '../types';
import { HistoryItem } from './HistoryItem';

interface HistoryPanelProps {
  history: HistoryItemType[];
  onPlay: (item: HistoryItemType) => void;
  onLoadSettings: (item: HistoryItemType) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12.5 7V12.25L16.5 14.5L15.82 15.66L11 13V7H12.5Z"></path>
    </svg>
);


export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onPlay, onLoadSettings, onDeleteItem, onClearAll }) => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <HistoryIcon className="w-6 h-6 text-cyan-400" />
            Generation History
        </h2>
        {history.length > 0 && (
            <button
                onClick={onClearAll}
                className="text-xs text-gray-400 hover:text-red-400 hover:underline transition-colors"
                title="Clear all history"
            >
                Clear All
            </button>
        )}
      </div>
      {history.length === 0 ? (
        <div className="text-center py-4 px-2 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
            Your generated videos will appear here.
            </p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[30vh] lg:max-h-60 overflow-y-auto pr-2">
          {history.map(item => (
            <HistoryItem 
              key={item.id} 
              item={item} 
              onPlay={onPlay} 
              onLoadSettings={onLoadSettings}
              onDeleteItem={onDeleteItem}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
