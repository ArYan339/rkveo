import { AspectRatio, AudioTrack } from './types';

export const ASPECT_RATIOS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:3', '3:4'];

export const AUDIO_TRACKS: AudioTrack[] = [
    { id: 'cinematic', name: 'Cinematic', url: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_81f2fd72df.mp3' },
    { id: 'lofi', name: 'Lofi Chill', url: 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_a708242967.mp3' },
    { id: 'sci-fi', name: 'Sci-Fi Ambient', url: 'https://cdn.pixabay.com/download/audio/2022/12/28/audio_1085333d59.mp3' },
    { id: 'epic', name: 'Epic Action', url: 'https://cdn.pixabay.com/download/audio/2022/05/29/audio_34354c2979.mp3' },
];


export const LOADING_MESSAGES: string[] = [
  "Warming up the AI's creative circuits...",
  "Teaching pixels to dance...",
  "Composing a symphony of light and motion...",
  "Gathering stardust for your scene...",
  "Directing the digital actors...",
  "Rendering your vision into reality...",
  "This can take a few minutes, the magic is happening.",
  "The final masterpiece is almost ready...",
];
