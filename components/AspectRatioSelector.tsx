
import React from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onChange: (aspectRatio: AspectRatio) => void;
  disabled: boolean;
}

const AspectRatioIcon: React.FC<{ ratio: AspectRatio }> = ({ ratio }) => {
  const dimensions: { [key in AspectRatio]: { w: number; h: number } } = {
    '16:9': { w: 20, h: 11.25 },
    '9:16': { w: 11.25, h: 20 },
    '1:1': { w: 16, h: 16 },
    '4:3': { w: 20, h: 15 },
    '3:4': { w: 15, h: 20 },
  };
  const { w, h } = dimensions[ratio];

  return (
    <div className="flex items-center justify-center w-6 h-6">
      <div
        className="bg-gray-500 rounded-sm"
        style={{ width: `${w}px`, height: `${h}px` }}
      />
    </div>
  );
};

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onChange, disabled }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-5 gap-2">
        {ASPECT_RATIOS.map((ratio) => (
          <button
            key={ratio}
            type="button"
            onClick={() => onChange(ratio)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all duration-200 ${
              selected === ratio
                ? 'bg-cyan-500/20 border-cyan-500 text-white'
                : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <AspectRatioIcon ratio={ratio} />
            <span className="text-xs mt-1 font-semibold">{ratio}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
