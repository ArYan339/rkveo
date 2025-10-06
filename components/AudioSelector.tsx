// FIX: Add a triple-slash directive to include DOM library types, resolving errors for DOM interfaces like 'HTMLAudioElement'.
/// <reference lib="dom" />

import React, { useState, useRef, useEffect } from 'react';
import { AudioTrack } from '../types';
import { AUDIO_TRACKS } from '../constants';

interface AudioSelectorProps {
  selected: AudioTrack | null;
  onChange: (audio: AudioTrack | null) => void;
  disabled: boolean;
}

const MusicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2C13.1046 2 14 2.89543 14 4V13.3414C13.6734 13.1201 13.2959 13 12.8889 13C11.2934 13 10 14.2934 10 15.8889C10 17.4844 11.2934 18.7778 12.8889 18.7778C14.4844 18.7778 15.7778 17.4844 15.7778 15.8889V8H18V4H14V2Z"></path>
    </svg>
);
const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
);
const PauseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path d="M5.5 3.5A1.5 1.5 0 017 5v10a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5zM12.5 3.5A1.5 1.5 0 0114 5v10a1.5 1.5 0 01-3 0V5a1.5 1.5 0 011.5-1.5z" /></svg>
);

export const AudioSelector: React.FC<AudioSelectorProps> = ({ selected, onChange, disabled }) => {
    const [previewingTrack, setPreviewingTrack] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioEl = audioRef.current;
        const handleEnded = () => setPreviewingTrack(null);
        if (audioEl) {
            audioEl.addEventListener('ended', handleEnded);
        }
        return () => {
            if (audioEl) {
                audioEl.removeEventListener('ended', handleEnded);
            }
        };
    }, []);


    const handlePreview = (e: React.MouseEvent, track: AudioTrack) => {
        e.stopPropagation();
        const audioEl = audioRef.current;
        if (!audioEl) return;

        if (previewingTrack === track.id) {
            audioEl.pause();
            setPreviewingTrack(null);
        } else {
            audioEl.src = track.url;
            audioEl.play();
            setPreviewingTrack(track.id);
        }
    };
    
    // Stop preview when disabled
    useEffect(() => {
        if (disabled && audioRef.current) {
            audioRef.current.pause();
            setPreviewingTrack(null);
        }
    }, [disabled]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <MusicIcon className="w-5 h-5" />
                Background Audio (Optional)
            </label>
            <audio ref={audioRef} />
            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    disabled={disabled}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    !selected
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                    <span className="font-semibold">No Audio</span>
                </button>
                {AUDIO_TRACKS.map((track) => (
                <button
                    key={track.id}
                    type="button"
                    onClick={() => onChange(track)}
                    disabled={disabled}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                    selected?.id === track.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    <span className="font-semibold">{track.name}</span>
                    <div 
                        className="p-1.5 rounded-full bg-gray-600/50 hover:bg-gray-500/50"
                        onClick={(e) => handlePreview(e, track)}
                        title={previewingTrack === track.id ? 'Pause Preview' : 'Play Preview'}
                    >
                        {previewingTrack === track.id ? (
                            <PauseIcon className="w-4 h-4 text-white"/>
                        ) : (
                            <PlayIcon className="w-4 h-4 text-white" />
                        )}
                    </div>
                </button>
                ))}
            </div>
        </div>
    );
};