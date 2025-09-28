
import React, { useState } from 'react';
import { CloseIcon } from './icons/Icons';

interface PromptEditorModalProps {
  prompt: string;
  onSave: (newPrompt: string) => void;
  onClose: () => void;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({ prompt, onSave, onClose }) => {
  const [currentPrompt, setCurrentPrompt] = useState(prompt);

  const handleSave = () => {
    onSave(currentPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-850 rounded-lg shadow-xl w-full max-w-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Prompt Editor</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700"><CloseIcon /></button>
        </div>
        <div className="p-4">
          <textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            className="w-full h-64 bg-slate-900 border border-slate-700 rounded-md p-2 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Describe your vision in detail..."
          />
        </div>
        <div className="flex justify-end p-4 border-t border-slate-700">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
