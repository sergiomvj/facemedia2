
export type Mode = 'Image' | 'Video';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface ImageFile {
  dataUrl: string;
  file: File;
}

export interface AppState {
  mode: Mode;
  prompt: string;
  negativePrompt: string;
  aspectRatio: AspectRatio;
  baseImage: ImageFile | null;
  blendImage: ImageFile | null;
}

export interface GenerationResult {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  text: string | null;
}

export interface StoredCreation {
  id: number;
  timestamp: number;
  state: AppState;
  result: GenerationResult;
}

export type PromptHelperLanguage = 'EN' | 'PT-BR';
