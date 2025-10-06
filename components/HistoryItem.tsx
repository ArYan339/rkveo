import React from 'react';
import { HistoryItem as HistoryItemType } from '../types';

const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
);
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /><path fillRule="evenodd" d="M12.5 20a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM2.5 5a7.5 7.5 0 1015 0 7.5 7.5 0 00-15 0z" clipRule="evenodd" /></svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


interface HistoryItemProps {
  item: HistoryItemType;
  onPlay: (item: HistoryItemType) => void;
  onLoadSettings: (item: HistoryItemType) => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item, onPlay, onLoadSettings, onDeleteItem }) => {
  const formattedDate = new Date(item.timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <li className="bg-gray-700/60 rounded-lg p-3 transition-all duration-200 hover:bg-gray-700/90 hover:ring-1 hover:ring-cyan-500/50">
      <div className="flex justify-between items-start">
        <div 
          className="flex-1 min-w-0 cursor-pointer group"
          onClick={() => onPlay(item)}
        >
          <p 
            className="text-sm font-medium text-white truncate group-hover:text-cyan-300"
            title={item.prompt}
          >
            {item.prompt}
          </p>
          <div className="text-xs text-gray-400 mt-1 flex items-center flex-wrap gap-x-3">
            <span>{formattedDate}</span>
            <span className="text-gray-600 font-bold">&middot;</span>
            <span>{item.aspectRatio}</span>
            {item.imageName && (
                <>
                <span className="text-gray-600 font-bold">&middot;</span>
                <span className="truncate max-w-[100px]" title={item.imageName}>Img: {item.imageName}</span>
                </>
            )}
            {item.audioName && (
                <>
                <span className="text-gray-600 font-bold">&middot;</span>
                <span className="truncate max-w-[100px]" title={item.audioName}>🎵 {item.audioName}</span>
                </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-0.5 ml-2 flex-shrink-0">
            <button
            onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
            title="Delete"
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
           <button
            onClick={(e) => { e.stopPropagation(); onLoadSettings(item); }}
            title="Use Settings"
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded-md transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
          <a
            href={item.videoUrl}
            download={`veo-vision-${item.id}.mp4`}
            onClick={(e) => e.stopPropagation()}
            title="Download"
            className="block p-1.5 text-gray-400 hover:text-white hover:bg-gray-600 rounded-md transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
          </a>
           <button
            onClick={(e) => { e.stopPropagation(); onPlay(item); }}
            title="Play Video"
            className="p-1.5 text-cyan-400 hover:text-white hover:bg-cyan-500/50 rounded-md transition-colors"
          >
            <PlayIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  );
};
