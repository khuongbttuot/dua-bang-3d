import React, { useState, useEffect } from 'react';
import { BoardImage, StudioSettings, ViewMode } from './types';
import { initialSampleBoards } from './data/sampleBoards';
import { Header } from './components/Header';
import { Board3DStage } from './components/Board3DStage';
import { Board3DCarousel } from './components/Board3DCarousel';
import { StudioControls } from './components/StudioControls';
import { ShortcutsModal } from './components/ShortcutsModal';
import { CustomCursor } from './components/CustomCursor';
import { AudioPlayerWidget } from './components/AudioPlayerWidget';

const defaultSettings: StudioSettings = {
  mode: 'stage',
  rotateX: 18,
  rotateY: -25,
  rotateZ: 0,
  scale: 1,
  depth: 16,
  perspective: 1300,
  autoRotate: false,
  autoRotateSpeed: 0.6,
  lightColor: '#ffffff',
  lightIntensity: 0.8,
  reflection: true,
  holographic: false,
  bevel: true,
  environment: 'cyber',
  floorGrid: true,
  interactiveTilt: true,
};

export default function App() {
  const [boards, setBoards] = useState<BoardImage[]>(() => {
    return initialSampleBoards;
  });
  const [selectedBoard, setSelectedBoard] = useState<BoardImage>(() => initialSampleBoards[0]);
  const [settings, setSettings] = useState<StudioSettings>(defaultSettings);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update specific settings
  const handleUpdateSettings = (newSettings: Partial<StudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
  };

  const handleModeChange = (mode: ViewMode) => {
    handleUpdateSettings({ mode });
  };

  const handleToggleAutoRotate = () => {
    handleUpdateSettings({ autoRotate: !settings.autoRotate });
  };

  // Switch to stage mode with specific board
  const handleOpenStage = (board: BoardImage) => {
    setSelectedBoard(board);
    handleUpdateSettings({ mode: 'stage' });
  };

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleToggleAutoRotate();
      } else if (e.code === 'ArrowLeft' && settings.mode === 'stage') {
        e.preventDefault();
        setBoards((prev) => {
          const idx = prev.findIndex((b) => b.id === selectedBoard.id);
          const prevIdx = (idx - 1 + prev.length) % prev.length;
          setSelectedBoard(prev[prevIdx]);
          return prev;
        });
      } else if (e.code === 'ArrowRight' && settings.mode === 'stage') {
        e.preventDefault();
        setBoards((prev) => {
          const idx = prev.findIndex((b) => b.id === selectedBoard.id);
          const nextIdx = (idx + 1) % prev.length;
          setSelectedBoard(prev[nextIdx]);
          return prev;
        });
      } else if (e.key === 'r' || e.key === 'R') {
        handleUpdateSettings({
          rotateX: 18,
          rotateY: -25,
          scale: 1,
          autoRotate: false,
        });
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      } else if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBoard, settings.mode, settings.autoRotate]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Top Header Navigation */}
      <Header
        currentMode={settings.mode}
        onModeChange={handleModeChange}
        autoRotate={settings.autoRotate}
        onToggleAutoRotate={handleToggleAutoRotate}
        onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        isSettingsOpen={isSettingsOpen}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        boardCount={boards.length}
      />

      {/* Main 3D Viewport Content based on Mode */}
      <main className="flex-1 flex flex-col w-full relative">
        {settings.mode === 'stage' && (
          <Board3DStage
            currentBoard={selectedBoard}
            allBoards={boards}
            onSelectBoard={setSelectedBoard}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {settings.mode === 'carousel' && (
          <Board3DCarousel
            boards={boards}
            activeBoard={selectedBoard}
            onSelectBoard={setSelectedBoard}
            onOpenStage={handleOpenStage}
            settings={settings}
          />
        )}
      </main>

      {/* Studio Settings Drawer */}
      <StudioControls
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetSettings={handleResetSettings}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Custom Cursor with Rilakkuma GIF & Spring Ribbon Trail (duongtran.xyz style) */}
      <CustomCursor />

      {/* Audio Player with "click" Autoplay Overlay & Volume Slider */}
      <AudioPlayerWidget />
    </div>
  );
}
