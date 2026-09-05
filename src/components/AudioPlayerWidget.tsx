import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Volume1, VolumeX, Play, Pause, Music } from 'lucide-react';
import songAudioFile from '../assets/song.mp3';

// Remote fallback if local asset has any stream issues in certain environments
const REMOTE_SONG_URL = 'https://duongtran.xyz/assets/audio/335368cbd866b945f8cad6d107457247.mp3';

export const AudioPlayerWidget: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayFading, setOverlayFading] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  // Initialize audio and attempt autoplay on mount
  useEffect(() => {
    const audio = new Audio();
    audio.src = songAudioFile || REMOTE_SONG_URL;
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    const handleCanPlay = () => setIsAudioLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Fallback source error handler
    const handleError = () => {
      if (audio.src !== REMOTE_SONG_URL) {
        audio.src = REMOTE_SONG_URL;
        audio.load();
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    // Try autoplay on mount (some browsers allow if permitted or unmuted)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setShowOverlay(false);
        })
        .catch(() => {
          // Autoplay blocked by browser policy -> show "click" overlay as requested
          setIsPlaying(false);
          setShowOverlay(true);
        });
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle overlay click to start music and dismiss overlay
  const handleStartAudio = () => {
    setOverlayFading(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setTimeout(() => {
      setShowOverlay(false);
    }, 300);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = prevVolume > 0 ? prevVolume : 0.8;
        setVolume(prevVolume > 0 ? prevVolume : 0.8);
      }
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  // Handle volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const effectiveVolume = isMuted ? 0 : volume;

  return (
    <>
      {/* 1. "click" Initial Overlay - Matching User Screenshot 1 */}
      {showOverlay && (
        <div
          onClick={handleStartAudio}
          className={`fixed inset-0 z-[999998] bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center select-none transition-opacity duration-300 ${
            overlayFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ cursor: 'pointer' }}
          title="Nhấn vào màn hình để bắt đầu phát nhạc"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <span className="text-white text-4xl sm:text-5xl font-bold tracking-wider hover:scale-110 transition-transform duration-200 select-none animate-pulse">
              click
            </span>
            <span className="text-xs text-neutral-400 font-medium tracking-wide">
              (Nhấn để phát nhạc & vào ứng dụng)
            </span>
          </div>
        </div>
      )}

      {/* 2. Floating Volume Control Pill - Matching User Screenshot 2 */}
      <div
        id="audio-volume-widget"
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/20 hover:border-white/40 rounded-2xl px-3.5 py-2 shadow-2xl shadow-black/90 ring-1 ring-white/10 transition-all duration-200 group"
      >
        {/* Speaker / Mute Button */}
        <button
          onClick={toggleMute}
          className="text-white hover:text-neutral-200 focus:outline-none transition-transform active:scale-95 flex items-center justify-center"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh (Mute)'}
          aria-label="Điều chỉnh âm thanh"
        >
          {effectiveVolume === 0 ? (
            <VolumeX className="w-5 h-5 text-neutral-400" />
          ) : effectiveVolume < 0.5 ? (
            <Volume1 className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Volume Slider Track with Thumb (matching Image 2) */}
        <div className="relative flex items-center w-28 sm:w-36 h-6">
          {/* Custom Track Background */}
          <div className="w-full h-1.5 bg-neutral-700/80 rounded-full overflow-hidden">
            {/* White Progress Fill */}
            <div
              className="h-full bg-white rounded-full transition-all duration-75"
              style={{ width: `${effectiveVolume * 100}%` }}
            />
          </div>

          {/* White Circular Thumb (Slider Knob) */}
          <div
            className="absolute w-3.5 h-3.5 bg-white rounded-full shadow-md pointer-events-none transition-all duration-75"
            style={{
              left: `calc(${effectiveVolume * 100}% - 7px)`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />

          {/* Invisible interactive range input covering the track */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={effectiveVolume}
            onChange={handleVolumeChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Thanh gạt âm lượng"
            title={`Âm lượng: ${Math.round(effectiveVolume * 100)}%`}
          />
        </div>

        {/* Play/Pause Minimal Toggle */}
        <button
          onClick={togglePlayPause}
          className="w-7 h-7 rounded-xl bg-neutral-800/90 hover:bg-neutral-700 text-white flex items-center justify-center transition-all ml-1 border border-neutral-700/60"
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
          aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white text-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
          )}
        </button>

        {/* Floating animated soundwaves indicator when playing */}
        {isPlaying && (
          <div className="hidden sm:flex items-center gap-0.5 pl-1" title="Đang phát: Thuyền Quyên Remix">
            <span className="w-0.5 h-3 bg-white animate-pulse" />
            <span className="w-0.5 h-4 bg-white/80 animate-pulse delay-75" />
            <span className="w-0.5 h-2 bg-white/60 animate-pulse delay-150" />
          </div>
        )}
      </div>
    </>
  );
};
