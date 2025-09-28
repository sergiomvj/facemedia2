
import React from 'react';
import { GenerationResult } from '../types';
import { SpinnerIcon, DownloadIcon, ImageIcon } from './icons/Icons';

interface MediaDisplayProps {
  result: GenerationResult | null;
  isLoading: boolean;
  loadingMessage: string;
  onUseAsBase: (imageUrl: string) => void;
}

const WelcomeMessage: React.FC = () => (
  <div className="text-center text-slate-400">
    <h2 className="text-2xl font-bold mb-2 text-slate-300">Welcome to FaceMedia Studio V2</h2>
    <p>Your creative journey starts here.</p>
    <p>Use the panel on the left to generate your first masterpiece.</p>
  </div>
);

const LoadingIndicator: React.FC<{ message: string }> = ({ message }) => (
  <div className="text-center">
    <SpinnerIcon className="w-12 h-12 mx-auto mb-4" />
    <p className="text-slate-300 animate-pulse">{message}</p>
  </div>
);

export const MediaDisplay: React.FC<MediaDisplayProps> = ({ result, isLoading, loadingMessage, onUseAsBase }) => {
  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.mediaUrl;
      const fileExtension = result.mediaType === 'image' ? 'jpg' : 'mp4';
      link.download = `facemedia_creation_${Date.now()}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col justify-center items-center aspect-square h-full w-full min-h-[300px] sm:min-h-[500px] lg:min-h-0 relative">
      {isLoading && <LoadingIndicator message={loadingMessage} />}
      {!isLoading && !result && <WelcomeMessage />}
      {!isLoading && result && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="relative w-full h-full group">
            {result.mediaType === 'image' ? (
              <img src={result.mediaUrl} alt="Generated media" className="object-contain w-full h-full rounded-md" />
            ) : (
              <video src={result.mediaUrl} controls className="object-contain w-full h-full rounded-md" />
            )}
             {result.mediaType === 'image' && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center gap-4 rounded-md">
                    <button onClick={handleDownload} title="Download Image" className="p-3 bg-slate-900/70 rounded-full hover:bg-indigo-600 transition-colors">
                        <DownloadIcon />
                    </button>
                    <button onClick={() => onUseAsBase(result.mediaUrl)} title="Use as Base Image" className="p-3 bg-slate-900/70 rounded-full hover:bg-indigo-600 transition-colors">
                        <ImageIcon />
                    </button>
                </div>
             )}
          </div>
          {result.text && (
            <p className="text-sm text-slate-300 bg-slate-850 p-3 rounded-md w-full max-h-24 overflow-y-auto">
              {result.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
