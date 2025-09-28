
import React, { useState, useCallback, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { MediaDisplay } from './components/MediaDisplay';
import { Header } from './components/Header';
import { GalleryModal } from './components/GalleryModal';
import { AppState, GenerationResult, StoredCreation, AspectRatio } from './types';
import * as geminiService from './services/geminiService';
import * as dbService from './services/dbService';

const initialState: AppState = {
  mode: 'Image',
  prompt: '',
  negativePrompt: '',
  aspectRatio: '1:1',
  baseImage: null,
  blendImage: null,
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
        setResult(generationResult);
        const creationToSave: Omit<StoredCreation, 'id'> = {
          timestamp: Date.now(),
          state: appState,
          result: generationResult,
        };
        await dbService.addCreation(creationToSave);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setLoadingMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Keep the error message for a few seconds before clearing
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
  
  const reloadCreation = useCallback((creation: StoredCreation) => {
    setAppState(creation.state);
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
        <MediaDisplay
          result={result}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          onUseAsBase={handleUseAsBase}
        />
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
