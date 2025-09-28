
import React from 'react';
import { Mode } from '../types';

interface ModeToggleProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  const isImageMode = mode === 'Image';
  return (
    <div className="flex items-center justify-center bg-slate-850 rounded-lg p-1 w-full max-w-xs mx-auto">
      <button
        onClick={() => onModeChange('Image')}
        className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
          isImageMode ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
        }`}
      >
        Image
      </button>
      <button
        onClick={() => onModeChange('Video')}
        className={`w-1/2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${
          !isImageMode ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700'
        }`}
      >
        Video
      </button>
    </div>
  );
};
