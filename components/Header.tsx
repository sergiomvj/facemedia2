
import React from 'react';

interface HeaderProps {
  onGalleryClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGalleryClick }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm p-4 sticky top-0 z-20 flex justify-between items-center border-b border-slate-700">
      <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        FaceMedia Studio V2
      </h1>
      <button
        onClick={onGalleryClick}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium transition-colors"
      >
        My Creations
      </button>
    </header>
  );
};
