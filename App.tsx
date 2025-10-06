// FIX: Add a triple-slash directive to include DOM library types, resolving errors for methods on 'window' like 'setInterval', 'alert', and 'confirm'.
/// <reference lib="dom" />

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ImageUploader } from './components/ImageUploader';
import { VideoResult } from './components/VideoResult';
import { generateVideo } from './services/geminiService';
import { AspectRatio, ImageFile, HistoryItem, AudioTrack } from './types';
import { LOADING_MESSAGES } from './constants';
import { HistoryPanel } from './components/HistoryPanel';
import { AudioSelector } from './components/AudioSelector';

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.2843 2.71573C13.6748 2.32521 14.308 2.32521 14.6985 2.71573L15.4142 3.43137L16.4749 2.37071C16.8654 1.98019 17.4986 1.98019 17.8891 2.37071L18.5948 3.07635C18.9853 3.46687 18.9853 4.10004 18.5948 4.49056L17.5251 5.56025L18.2843 6.31944C18.6748 6.71 18.6748 7.34316 18.2843 7.73369L11.0118 15.0062C10.2921 15.7259 9.04332 15.7925 8.24311 15.193L2.80705 11.7569C1.90213 11.0877 1.83357 9.75946 2.67332 8.91971L13.2843 2.71573ZM20 18V20H22V18H20ZM18 15V17H20V15H18ZM15 12V14H17V12H15Z"></path>
    </svg>
);

const NewProjectIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 3 3 3ZM11 11H8V13H11V16H13V13H16V11H13V8H11V11Z"></path>
    </svg>
);


const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [image, setImage] = useState<ImageFile | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [audio, setAudio] = useState<AudioTrack | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Load history from localStorage on initial render
    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('veo-vision-history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to load history from localStorage", e);
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('veo-vision-history', JSON.stringify(history));
        } catch (e) {
            console.error("Failed to save history to localStorage", e);
        }
    }, [history]);

    useEffect(() => {
        let interval: number | undefined;
        if (isLoading && !loadingMessage.startsWith("Checking progress")) {
            let i = 0;
            const intervalCallback = () => {
                 setLoadingMessage(LOADING_MESSAGES[i % LOADING_MESSAGES.length]);
                 i++;
            };
            intervalCallback(); // run immediately
            interval = window.setInterval(intervalCallback, 4000);
        }
        return () => clearInterval(interval);
    }, [isLoading, loadingMessage]);

    const handleGenerateVideo = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt to generate a video.");
            return;
        }
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setGeneratedVideoUrl(null);

        try {
            const videoUrl = await generateVideo(
                { prompt, image, aspectRatio, audio },
                setLoadingMessage
            );
            const newHistoryItem: HistoryItem = {
                id: `vid-${Date.now()}`,
                prompt,
                imageName: image ? image.name : null,
                aspectRatio,
                audioName: audio ? audio.name : null,
                videoUrl,
                timestamp: Date.now(),
            };
            setHistory(prev => [newHistoryItem, ...prev]);
            setGeneratedVideoUrl(videoUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [prompt, image, aspectRatio, audio, isLoading]);

    const handlePlayHistoryVideo = useCallback((item: HistoryItem) => {
        setGeneratedVideoUrl(item.videoUrl);
        setError(null);
    }, []);

    const handleLoadHistorySettings = useCallback((item: HistoryItem) => {
        setPrompt(item.prompt);
        setAspectRatio(item.aspectRatio);
        setImage(null);
        setAudio(null);
        alert("Settings loaded. The original image and audio (if any) were not restored and must be re-selected.");
    }, []);

    const handleDeleteHistoryItem = useCallback((id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    }, []);

    const handleClearHistory = useCallback(() => {
        if (window.confirm("Are you sure you want to clear the entire generation history? This action cannot be undone.")) {
            setHistory([]);
        }
    }, []);
    
    const handleStartNew = useCallback(() => {
        setPrompt('');
        setImage(null);
        setAspectRatio('16:9');
        setAudio(null);
        setGeneratedVideoUrl(null);
        setError(null);
    }, []);


    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row font-sans">
            {/* Controls Panel */}
            <aside className="w-full lg:w-1/3 xl:w-1/4 p-6 bg-gray-800/50 lg:h-screen lg:overflow-y-auto border-r border-gray-700">
                <div className="max-w-md mx-auto">
                    <Header />
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                                Your Vision
                            </label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A neon hologram of a cat driving a sports car at top speed"
                                rows={4}
                                disabled={isLoading}
                                className="w-full bg-gray-700/50 text-white rounded-lg border-2 border-gray-600 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 p-2 placeholder:text-gray-500 disabled:opacity-50"
                            />
                        </div>
                        <ImageUploader image={image} onImageChange={setImage} disabled={isLoading} />
                        <AspectRatioSelector selected={aspectRatio} onChange={setAspectRatio} disabled={isLoading} />
                        <AudioSelector selected={audio} onChange={setAudio} disabled={isLoading} />
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleStartNew}
                                disabled={isLoading}
                                className="w-auto flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Start New Project"
                            >
                                <NewProjectIcon className="w-5 h-5" />
                                <span>New</span>
                            </button>
                            <button
                                onClick={handleGenerateVideo}
                                disabled={isLoading || !prompt.trim()}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Generating...</span>
                                    </>
                                ) : (
                                    <>
                                        <MagicWandIcon className="w-5 h-5" />
                                        <span>Generate Video</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                     <HistoryPanel 
                        history={history}
                        onPlay={handlePlayHistoryVideo}
                        onLoadSettings={handleLoadHistorySettings}
                        onDeleteItem={handleDeleteHistoryItem}
                        onClearAll={handleClearHistory}
                    />
                </div>
            </aside>

            {/* Video Result Panel */}
            <main className="flex-1 p-6 flex items-center justify-center bg-gray-900 lg:h-screen">
                <div className="w-full h-full max-w-5xl max-h-[80vh] bg-black/20 rounded-xl border border-gray-700 flex items-center justify-center">
                   <VideoResult 
                        videoUrl={generatedVideoUrl}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        error={error}
                   />
                </div>
            </main>
        </div>
    );
};

export default App;