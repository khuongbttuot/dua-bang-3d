import React, { useState, useEffect } from 'react';
import { 
  Box, 
  GalleryVertical, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  SlidersHorizontal,
  HelpCircle
} from 'lucide-react';
import { ViewMode } from '../types';

import brandLogo from '../assets/logo.jpg';

interface HeaderProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onToggleSettings: () => void;
  isSettingsOpen: boolean;
  onOpenShortcuts: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  boardCount: number;
}

// Hiệu ứng chữ "DỪA" gõ xuất hiện lần lượt từng chữ một, sau đó lặp lại mượt mà
const AnimatedBrandText: React.FC = () => {
  const fullWord = 'DỪA';
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayedText.length < fullWord.length) {
        // Gõ thêm từng ký tự một (300ms mỗi ký tự)
        timer = setTimeout(() => {
          setDisplayedText(fullWord.slice(0, displayedText.length + 1));
        }, 300);
      } else {
        // Đã hiện đủ chữ "DỪA", dừng lại 2.2 giây để người xem nhìn rõ
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        // Xóa lùi từng ký tự (150ms)
        timer = setTimeout(() => {
          setDisplayedText(fullWord.slice(0, displayedText.length - 1));
        }, 150);
      } else {
        // Đã xóa hết, dừng 500ms trước khi bắt đầu gõ lại chữ DỪA
        timer = setTimeout(() => {
          setIsDeleting(false);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting]);

  return (
    <div className="flex items-center gap-1.5" aria-label="Thương hiệu DỪA">
      <span 
        className="font-black text-xl sm:text-2xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-[0_0_16px_rgba(245,158,11,0.6)] select-none min-w-[55px]"
      >
        {displayedText}
      </span>
      {/* Con trỏ nhấp nháy sang trọng */}
      <span className="inline-block w-0.5 h-5 sm:h-6 bg-amber-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  autoRotate,
  onToggleAutoRotate,
  onToggleSettings,
  isSettingsOpen,
  onOpenShortcuts,
  isFullscreen,
  onToggleFullscreen,
  boardCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d0d0d]/95 backdrop-blur-md border-b border-neutral-800/80 px-2.5 sm:px-6 py-2 sm:py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand: Hiển thị logo data/logo.jpg & chữ DỪA gõ lần lượt từng chữ */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Logo data/logo.jpg */}
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-lg shadow-amber-400/20 ring-1 ring-amber-400/60 shrink-0 bg-neutral-900">
            <img
              src={brandLogo}
              alt="Logo DỪA"
              className="w-full h-full object-cover select-none"
            />
          </div>

          {/* Chữ DỪA xuất hiện lần lượt từng chữ một */}
          <div className="flex flex-col justify-center">
            <AnimatedBrandText />
            <p className="text-[10px] sm:text-xs text-neutral-400 hidden sm:flex items-center gap-1.5 font-medium select-none">
              Trình diễn bảng điểm hai mặt • <span className="text-neutral-200 font-semibold">{boardCount} bảng</span>
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <nav aria-label="Chế độ hiển thị" className="flex items-center bg-neutral-900/90 p-0.5 sm:p-1 rounded-xl border border-neutral-800 shadow-inner">
          <button
            onClick={() => onModeChange('stage')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              currentMode === 'stage'
                ? 'bg-white text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
            title="Sân khấu Studio xoay đa hướng"
          >
            <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Sân Khấu</span>
          </button>

          <button
            onClick={() => onModeChange('carousel')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              currentMode === 'carousel'
                ? 'bg-white text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
            title="Băng chuyền xoay vòng tròn"
          >
            <GalleryVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Băng Chuyền</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Auto-Rotate Toggle */}
          <button
            onClick={onToggleAutoRotate}
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              autoRotate
                ? 'bg-white text-neutral-950 border-white shadow-sm font-bold'
                : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
            title={autoRotate ? 'Tắt tự động xoay' : 'Bật tự động xoay'}
          >
            <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${autoRotate ? 'animate-spin text-neutral-950' : ''}`} />
            <span className="hidden md:inline">{autoRotate ? 'Đang Xoay' : 'Tự Xoay'}</span>
          </button>

          {/* Shortcuts Help - chỉ hiện trên desktop có bàn phím */}
          <button
            onClick={onOpenShortcuts}
            className="p-1.5 sm:p-2 rounded-lg bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-neutral-200 hover:bg-neutral-800 transition-colors hidden sm:flex"
            title="Phím tắt điều khiển"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Studio Controls Drawer Toggle */}
          <button
            onClick={onToggleSettings}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all ${
              isSettingsOpen
                ? 'bg-white text-neutral-950 border-white shadow-md font-bold'
                : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:bg-neutral-800'
            }`}
            title="Tùy chỉnh góc 3D, đèn chiếu & hiệu ứng"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="p-1.5 sm:p-2 rounded-lg bg-neutral-900/80 text-neutral-400 border border-neutral-800 hover:text-neutral-200 hover:bg-neutral-800 transition-colors hidden sm:flex"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
