
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from '@google/genai';
import { AspectRatio, GenerationResult } from '../types';
import { VIDEO_POLLING_MESSAGES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateImage = async (
  prompt: string,
  negativePrompt: string,
  aspectRatio: AspectRatio
): Promise<GenerationResult> => {
  const fullPrompt = negativePrompt ? `${prompt}, negative prompt: ${negativePrompt}` : prompt;
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: fullPrompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
    },
  });

  const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
  const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

  return { mediaUrl: imageUrl, mediaType: 'image', text: null };
};

export const editImage = async (
  prompt: string,
  baseImage: File,
  blendImage: File | null
): Promise<GenerationResult> => {
  const baseImagePart = await fileToGenerativePart(baseImage);
  const textPart = { text: prompt };
  const parts = [baseImagePart, textPart];

  if (blendImage) {
    const blendImagePart = await fileToGenerativePart(blendImage);
    parts.splice(1, 0, blendImagePart); // Insert blend image after base
  }
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  
  let result: GenerationResult = { mediaUrl: '', mediaType: 'image', text: '' };
  
  // Note: API can return multiple parts. We find the first image and first text.
  for (const part of response.candidates[0].content.parts) {
    if (part.text && !result.text) {
        result.text = part.text;
    } else if (part.inlineData && !result.mediaUrl) {
        const base64ImageBytes: string = part.inlineData.data;
        result.mediaUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  if (!result.mediaUrl) {
      throw new Error("Image editing failed to produce an image.");
  }

  return result;
};


export const generateVideo = async (
  prompt: string,
  baseImage: File | null,
  onProgress: (message: string) => void
): Promise<GenerationResult> => {
  let imagePayload;
  if (baseImage) {
    const base64String = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(baseImage);
    });
    imagePayload = {
      imageBytes: base64String,
      mimeType: baseImage.type,
    };
  }

  let operation = await ai.models.generateVideos({
    model: 'veo-2.0-generate-001',
    prompt,
    ...(imagePayload && { image: imagePayload }),
    config: {
      numberOfVideos: 1,
    }
  });

  let messageIndex = 0;
  while (!operation.done) {
    onProgress(VIDEO_POLLING_MESSAGES[messageIndex % VIDEO_POLLING_MESSAGES.length]);
    messageIndex++;
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("Video generation completed but no download link was found.");
  }
  
  onProgress("Downloading video...");
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }
  const videoBlob = await response.blob();
  const videoUrl = URL.createObjectURL(videoBlob);

  return { mediaUrl: videoUrl, mediaType: 'video', text: null };
};

export const translateText = async (text: string): Promise<string> => {
    if (!text.trim()) return '';
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Translate the following text to English, even if it's already in English or contains mixed languages. Return only the translation:\n\n${text}`,
        config: {
            temperature: 0.1,
        }
    });

    return response.text.trim();
};

export const buildPrompt = async (type: string, subject: string, style: string, details: string): Promise<string> => {
    const userPrompt = `
      - Type: ${type}
      - Subject: ${subject}
      - Style: ${style}
      - Details: ${details}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Based on the following keywords, create a single, highly detailed, and creative prompt for an image generation AI. The prompt should be a single paragraph. Be descriptive and evocative. Keywords:\n${userPrompt}`,
        config: {
            temperature: 0.8,
        }
    });

    return response.text.trim();
};
