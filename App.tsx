
import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { MediaDisplay } from './components/MediaDisplay';
import { Header } from './components/Header';
import { GalleryModal } from './components/GalleryModal';
import { AppState, GenerationResult, StoredCreation, ImageHistoryItem } from './types';
import * as geminiService from './services/geminiService';
import * as dbService from './services/dbService';

const initialState: AppState = {
  mode: 'Image',
  prompt: '',
  negativePrompt: '',
  aspectRatio: '1:1',
  baseImage: null,
  blendImage: null,
  videoAspectRatio: '16:9',
  videoDuration: 4,
  imageHistory: [],
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(initialState);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    dbService.openDb();
  }, []);

  const clearAll = useCallback(() => {
    setAppState(initialState);
    setResult(null);
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setResult(null);

    try {
      let generationResult: GenerationResult | null = null;
      if (appState.mode === 'Video') {
        setLoadingMessage('Initializing video generation...');
        generationResult = await geminiService.generateVideo(
          appState.prompt,
          appState.baseImage?.file || null,
          appState.videoAspectRatio,
          appState.videoDuration,
          (message) => setLoadingMessage(message)
        );
      } else {
        if (appState.baseImage) {
          setLoadingMessage('Editing image...');
          generationResult = await geminiService.editImage(
            appState.prompt,
            appState.baseImage.file,
            appState.blendImage?.file || null
          );
        } else {
          setLoadingMessage('Creating new image...');
          generationResult = await geminiService.generateImage(
            appState.prompt,
            appState.negativePrompt,
            appState.aspectRatio
          );
        }
      }

      if (generationResult) {
        const { imageHistory, ...stateToSave } = appState;
        const creationToSave: Omit<StoredCreation, 'id'> = {
          timestamp: Date.now(),
          state: stateToSave,
          result: generationResult,
        };
        await dbService.addCreation(creationToSave);
        
        setResult(generationResult);

        if (generationResult.mediaType === 'image') {
            setAppState(prev => ({
                ...prev,
                imageHistory: [
                    { mediaUrl: generationResult.mediaUrl, prompt: appState.prompt },
                    ...prev.imageHistory
                ]
            }));
        }
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setLoadingMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => {
          if(loadingMessage.startsWith("Error")) setLoadingMessage('');
      }, 5000);
    } finally {
      setIsLoading(false);
      if (!loadingMessage.startsWith("Error")) {
          setLoadingMessage('');
      }
    }
  }, [appState, loadingMessage]);

  const handleUseAsBase = useCallback(async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "generated_base.png", { type: blob.type });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppState(prev => ({
          ...initialState,
          imageHistory: prev.imageHistory, // Preserve history
          mode: 'Image',
          baseImage: { dataUrl: reader.result as string, file },
        }));
        setResult(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to use image as base:", error);
    }
  }, []);

  const handleUseFromHistory = useCallback(async (item: ImageHistoryItem) => {
    try {
        const response = await fetch(item.mediaUrl);
        const blob = await response.blob();
        const file = new File([blob], "history_base.png", { type: blob.type });
        const reader = new FileReader();
        reader.onloadend = () => {
            setAppState(prev => ({
                ...initialState,
                imageHistory: prev.imageHistory, // Preserve history
                mode: 'Image',
                prompt: item.prompt,
                baseImage: { dataUrl: reader.result as string, file },
            }));
            setResult(null);
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error("Failed to use image from history:", error);
    }
  }, []);
  
  const reloadCreation = useCallback((creation: StoredCreation) => {
    setAppState(prev => ({
        ...initialState,
        ...creation.state,
        imageHistory: prev.imageHistory, // Preserve history
    }));
    setResult(creation.result);
    setIsGalleryOpen(false);
  }, []);


  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header onGalleryClick={() => setIsGalleryOpen(true)} />
      <main className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-screen-2xl mx-auto">
        <ControlPanel
          appState={appState}
          setAppState={setAppState}
          isLoading={isLoading}
          onGenerate={handleGenerate}
          onClearAll={clearAll}
        />
        <div className="flex flex-col gap-8">
            <MediaDisplay
              result={result}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              onUseAsBase={handleUseAsBase}
            />
            {appState.imageHistory.length > 0 && (
              <div className="bg-slate-800 p-4 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-slate-300">Image History</h3>
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {appState.imageHistory.map((item, index) => (
                    <li key={`${item.mediaUrl}-${index}`} className="flex items-center gap-4 bg-slate-850 p-2 rounded-md">
                      <img src={item.mediaUrl} alt="History thumbnail" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-400 truncate" title={item.prompt}>{item.prompt || 'No prompt provided'}</p>
                      </div>
                      <button
                        onClick={() => handleUseFromHistory(item)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-indigo-600 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
                      >
                        Use as Base
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </main>
      {isGalleryOpen && (
        <GalleryModal
          onClose={() => setIsGalleryOpen(false)}
          onReload={reloadCreation}
        />
      )}
    </div>
  );
};

export default App;