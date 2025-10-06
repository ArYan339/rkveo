import React from 'react';
import { LOADING_MESSAGES } from '../constants';

interface VideoResultProps {
  videoUrl: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const PlaceholderIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 9.293a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const LoadingSpinner: React.FC = () => (
  <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
);

export const VideoResult: React.FC<VideoResultProps> = ({ videoUrl, isLoading, loadingMessage, error }) => {
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-white h-full">
                <LoadingSpinner />
                <p className="mt-4 text-lg font-semibold animate-pulse">{loadingMessage}</p>
                <p className="mt-2 text-sm text-gray-400">Please keep this window open.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-white h-full bg-red-500/10 border border-red-500 rounded-lg p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="mt-3 text-xl font-bold">Generation Failed</h3>
                <p className="mt-2 text-sm text-red-300 max-w-md">{error}</p>
            </div>
        );
    }
    
    if (videoUrl) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="max-w-full max-h-full rounded-lg shadow-2xl shadow-cyan-500/20"
                />
                <a
                    href={videoUrl}
                    download="veo-vision-video.mp4"
                    className="absolute bottom-4 right-4 flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                    aria-label="Download video"
                >
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download</span>
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full">
            <PlaceholderIcon className="w-24 h-24" />
            <h3 className="mt-4 text-xl font-semibold text-gray-300">Your video will appear here</h3>
            <p className="mt-1 max-w-sm">Fill out the details on the left and click "Generate" to bring your vision to life.</p>
        </div>
    );
};