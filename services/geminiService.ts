// FIX: Add a triple-slash directive to include DOM library types, which are necessary for browser-specific globals like 'alert'.
/// <reference lib="dom" />

import { GoogleGenAI } from "@google/genai";
import { VideoGenerationOptions } from '../types';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// Lazily initialize the AI client to provide a better error message if the API key is missing.
let ai: GoogleGenAI | null = null;
let ffmpeg: FFmpeg | null = null;

function getAiClient(): GoogleGenAI {
  if (ai) {
    return ai;
  }
  
  if (!process.env.API_KEY) {
    // This error is critical for users deploying to services like Vercel.
    throw new Error("API key not configured. Please set the API_KEY environment variable in your hosting provider's settings. The application cannot connect to the AI service without it.");
  }

  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai;
}

async function loadFFmpeg(setLoadingMessage: (message: string) => void): Promise<FFmpeg> {
    if (ffmpeg && ffmpeg.loaded) {
        return ffmpeg;
    }
    setLoadingMessage("Initializing video processor...");
    ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }) => {
        console.log(`[FFmpeg]: ${message}`);
    });
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core-st@0.12.6/dist/esm'
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpeg;
}

// A helper to format error messages for the user.
function formatErrorMessage(error: unknown): string {
    let errorMessage = "An unknown error occurred during video generation.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    
    // Provide user-friendly messages for common API errors.
    if (errorMessage.includes("billing enabled")) {
      return "Video generation failed. The Veo model requires Google Cloud Platform billing to be enabled for your API key. Please check your account's billing status and API key permissions.";
    } else if (errorMessage.includes("API key not valid")) {
      return "Invalid API key. Please ensure your API key is correctly configured and has the necessary permissions to use the Veo model.";
    }
    
    return errorMessage;
}


export async function generateVideo(
  options: VideoGenerationOptions,
  setLoadingMessage: (message: string) => void
): Promise<string> {
  const { prompt, image, aspectRatio, audio } = options;
  
  // Get the AI client. This will throw a user-friendly error if the API key is missing.
  const localAi = getAiClient();
  const apiKey = process.env.API_KEY!; // We know it's defined because getAiClient would have thrown otherwise.

  setLoadingMessage("Initiating video generation...");

  const generateVideosParams: any = {
    model: 'veo-2.0-generate-001',
    prompt,
    config: {
      numberOfVideos: 1,
      aspectRatio,
    },
  };

  if (image) {
    generateVideosParams.image = {
      imageBytes: image.base64,
      mimeType: image.mimeType,
    };
  }

  try {
    let operation = await localAi.models.generateVideos(generateVideosParams);
    
    setLoadingMessage("Request sent. The model is now processing...");
    
    let checks = 0;
    while (!operation.done) {
      checks++;
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      setLoadingMessage(`Checking progress (attempt ${checks})... This can take a few minutes.`);
      operation = await localAi.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(operation.error.message || "Operation failed with an unknown error.");
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Video generation succeeded but no download link was provided.");
    }
    
    setLoadingMessage("Downloading generated video...");
    const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }
    const videoBlob = await videoResponse.blob();
    const silentVideoUrl = URL.createObjectURL(videoBlob);

    if (!audio) {
      setLoadingMessage("Video ready!");
      return silentVideoUrl; // No audio selected, return silent video
    }

    // --- Audio Merging Logic ---
    try {
        const ffmpegInstance = await loadFFmpeg(setLoadingMessage);

        setLoadingMessage("Preparing audio and video files...");
        
        // Fetch audio and convert to Uint8Array
        const audioResponse = await fetch(audio.url);
        const audioBlob = await audioResponse.blob();
        
        await ffmpegInstance.writeFile('input.mp4', new Uint8Array(await videoBlob.arrayBuffer()));
        await ffmpegInstance.writeFile('audio.mp3', new Uint8Array(await audioBlob.arrayBuffer()));
        
        setLoadingMessage("Combining video and audio... this can take a moment.");
        await ffmpegInstance.exec(['-i', 'input.mp4', '-i', 'audio.mp3', '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0', '-shortest', 'output.mp4']);
        
        const data = await ffmpegInstance.readFile('output.mp4');
        const mergedVideoBlob = new Blob([data], { type: 'video/mp4' });
        const mergedVideoUrl = URL.createObjectURL(mergedVideoBlob);

        URL.revokeObjectURL(silentVideoUrl); // Clean up silent video blob URL
        setLoadingMessage("Video ready!");
        return mergedVideoUrl;
        
    } catch (mergeError) {
        console.error("Error merging audio:", mergeError);
        alert("Could not merge audio due to an error. The video has been generated without sound. Check console for details.");
        return silentVideoUrl; // Fallback to silent video
    }

  } catch (error) {
    console.error("Error generating video:", error);
    throw new Error(formatErrorMessage(error));
  }
}