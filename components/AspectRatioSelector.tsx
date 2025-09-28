import React from 'react';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onSelect: (ratio: AspectRatio) => void;
  ratios?: AspectRatio[];
}

const ratioToClass: Record<AspectRatio, string> = {
  '1:1': 'w-8 h-8',
  '16:9': 'w-12 h-6.5',
  '9:16': 'w-6.5 h-12',
  '4:3': 'w-10 h-7.5',
  '3:4': 'w-7.5 h-10',
};

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onSelect, ratios = ASPECT_RATIOS }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
      <div className="flex items-end justify-between gap-2">
        {ratios.map((ratio) => (
          <div key={ratio} className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => onSelect(ratio)}
              className={`flex items-center justify-center rounded-sm transition-all duration-200 ${
                selected === ratio ? 'bg-indigo-500' : 'bg-slate-600 hover:bg-slate-500'
              } ${ratioToClass[ratio]}`}
            />
            <span className={`text-xs ${selected === ratio ? 'text-indigo-400' : 'text-slate-400'}`}>{ratio}</span>
          </div>
        ))}
      </div>
    </div>
  );
};