
import React, { useState } from 'react';
import { AppState } from '../types';
import { ModeToggle } from './ModeToggle';
import { ImageUploader } from './ImageUploader';
import { AspectRatioSelector } from './AspectRatioSelector';
import { PromptEditorModal } from './PromptEditorModal';
import { PromptHelperModal } from './PromptHelperModal';
import { SpinnerIcon, ExpandIcon, LightbulbIcon, TranslateIcon } from './icons/Icons';
import * as geminiService from '../services/geminiService';

interface ControlPanelProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  isLoading: boolean;
  onGenerate: () => void;
  onClearAll: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  appState,
  setAppState,
  isLoading,
  onGenerate,
  onClearAll,
}) => {
  const { mode, prompt, negativePrompt, aspectRatio, baseImage, blendImage } = appState;
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isHelperOpen, setIsHelperOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState({ prompt: false, negative: false });

  const handleStateChange = <K extends keyof AppState>(key: K, value: AppState[K]) => {
    setAppState(prev => ({ ...prev, [key]: value }));
  };

  const handleTranslate = async (field: 'prompt' | 'negativePrompt') => {
    setIsTranslating(prev => ({...prev, [field]: true}));
    try {
        const textToTranslate = field === 'prompt' ? prompt : negativePrompt;
        const translatedText = await geminiService.translateText(textToTranslate);
        handleStateChange(field, translatedText);
    } catch (error) {
        console.error("Translation failed:", error);
    } finally {
        setIsTranslating(prev => ({...prev, [field]: false}));
    }
  };

  const isEditMode = mode === 'Image' && !!baseImage;
  const buttonText = mode === 'Video' ? 'Generate Video' : (isEditMode ? 'Generate' : 'Create');

  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col gap-6 h-fit">
      <ModeToggle mode={mode} onModeChange={(newMode) => handleStateChange('mode', newMode)} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageUploader
          label="Base Image"
          image={baseImage}
          onImageChange={(img) => handleStateChange('baseImage', img)}
        />
        {mode === 'Image' && isEditMode && (
          <ImageUploader
            label="Blend Image (Optional)"
            image={blendImage}
            onImageChange={(img) => handleStateChange('blendImage', img)}
          />
        )}
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-1">
          Describe Your Vision
        </label>
        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => handleStateChange('prompt', e.target.value)}
            placeholder="e.g., A majestic lion wearing a crown, cinematic lighting"
            className="w-full bg-slate-850 border border-slate-700 rounded-md p-2 pr-28 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            rows={4}
            disabled={isLoading}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1.5">
            <button onClick={() => setIsEditorOpen(true)} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded" title="Expand Editor"><ExpandIcon /></button>
            <button onClick={() => setIsHelperOpen(true)} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded" title="Prompting Tips"><LightbulbIcon /></button>
            <button onClick={() => handleTranslate('prompt')} disabled={isTranslating.prompt} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded" title="Translate to English">
              {isTranslating.prompt ? <SpinnerIcon /> : <TranslateIcon />}
            </button>
          </div>
        </div>
      </div>
      
      {mode === 'Image' && !isEditMode && (
        <div>
          <label htmlFor="negativePrompt" className="block text-sm font-medium text-slate-300 mb-1">
            Negative Prompt (Optional)
          </label>
           <div className="relative">
            <textarea
              id="negativePrompt"
              value={negativePrompt}
              onChange={(e) => handleStateChange('negativePrompt', e.target.value)}
              placeholder="e.g., blurry, watermark, poorly drawn"
              className="w-full bg-slate-850 border border-slate-700 rounded-md p-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              rows={2}
              disabled={isLoading}
            />
            <div className="absolute top-2 right-2">
                <button onClick={() => handleTranslate('negativePrompt')} disabled={isTranslating.negative} className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded" title="Translate to English">
                    {isTranslating.negative ? <SpinnerIcon /> : <TranslateIcon />}
                </button>
            </div>
          </div>
        </div>
      )}
      
      {mode === 'Image' && !isEditMode && (
        <AspectRatioSelector
          selected={aspectRatio}
          onSelect={(val) => handleStateChange('aspectRatio', val)}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <button
          onClick={onGenerate}
          disabled={isLoading || !prompt}
          className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading && <SpinnerIcon />}
          {isLoading ? 'Generating...' : buttonText}
        </button>
        <button
          onClick={onClearAll}
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-slate-200 font-semibold rounded-md hover:bg-slate-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      {isEditorOpen && (
        <PromptEditorModal
          prompt={prompt}
          onSave={(newPrompt) => handleStateChange('prompt', newPrompt)}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
      {isHelperOpen && (
        <PromptHelperModal
          onClose={() => setIsHelperOpen(false)}
          onInsertText={(text) => handleStateChange('prompt', prompt ? `${prompt}, ${text}`: text)}
        />
      )}
    </div>
  );
};
