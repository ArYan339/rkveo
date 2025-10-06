export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '3:4';

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
}

export interface VideoGenerationOptions {
  prompt: string;
  image?: ImageFile;
  aspectRatio: AspectRatio;
  audio?: AudioTrack;
}

export interface HistoryItem {
  id: string;
  prompt: string;
  imageName: string | null;
  aspectRatio: AspectRatio;
  audioName: string | null;
  videoUrl: string;
  timestamp: number;
}
