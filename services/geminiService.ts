// FIX: Add a triple-slash directive to include DOM library types, which are necessary for browser-specific globals like 'alert'.
/// <reference lib="dom" />

import { GoogleGenAI } from "@google/genai";
import { VideoGenerationOptions } from '../types';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

// The user has provided an API key to fix the application.
const API_KEY = "AIzaSyCJPe3Z5esszL2lJkreFRX4r0GMwS0Nkdw";

const ai = new GoogleGenAI({ apiKey: API_KEY });
let ffmpeg: FFmpeg | null = null;

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


export async function generateVideo(
  options: VideoGenerationOptions,
  setLoadingMessage: (message: string) => void
): Promise<string> {
  const { prompt, image, aspectRatio, audio } = options;
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
    let operation = await ai.models.generateVideos(generateVideosParams);
    
    setLoadingMessage("Request sent. The model is now processing...");
    
    let checks = 0;
    while (!operation.done) {
      checks++;
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      setLoadingMessage(`Checking progress (attempt ${checks})... This can take a few minutes.`);
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) {
      throw new Error(`Operation failed: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("Video generation succeeded but no download link was provided.");
    }
    
    setLoadingMessage("Downloading generated video...");
    const videoResponse = await fetch(`${downloadLink}&key=${API_KEY}`);
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
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during video generation.";
    throw new Error(errorMessage);
  }
}