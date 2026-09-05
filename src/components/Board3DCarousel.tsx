import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Box, Sparkles } from 'lucide-react';
import { BoardImage, StudioSettings } from '../types';

interface Board3DCarouselProps {
  boards: BoardImage[];
  activeBoard: BoardImage;
  onSelectBoard: (board: BoardImage) => void;
  onOpenStage: (board: BoardImage) => void;
  settings: StudioSettings;
}

export const Board3DCarousel: React.FC<Board3DCarouselProps> = ({
  boards,
  activeBoard,
  onSelectBoard,
  onOpenStage,
  settings,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const idx = boards.findIndex((b) => b.id === activeBoard.id);
    if (idx !== -1) setActiveIndex(idx);
  }, [activeBoard, boards]);

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + boards.length) % boards.length;
    setActiveIndex(nextIdx);
    onSelectBoard(boards[nextIdx]);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % boards.length;
    setActiveIndex(nextIdx);
    onSelectBoard(boards[nextIdx]);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between min-h-[calc(100vh-65px)] overflow-hidden px-4 py-8 select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,#1a1a1a_0%,#0a0a0a_80%)]" />

      {/* Top Header */}
      <div className="relative z-10 text-center max-w-xl">
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-200 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
          Chế Độ Băng Chuyền
        </span>
        <h2 className="text-2xl font-bold text-white mt-2">
          Băng Chuyền Trưng Bày Đa Chiều
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Duyệt qua các mẫu bảng xếp hạng theo dạng thẻ xoay với góc nghiêng phối cảnh thực
        </p>
      </div>

      {/* 3D CAROUSEL COVERFLOW STAGE */}
      <div 
        className="relative z-10 w-full max-w-6xl h-[460px] flex items-center justify-center my-auto preserve-3d"
        style={{ perspective: '1200px' }}
      >
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-6 z-40 p-3.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-white backdrop-blur-md shadow-2xl transition-transform hover:scale-110 active:scale-95"
          title="Bảng trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-6 z-40 p-3.5 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-white backdrop-blur-md shadow-2xl transition-transform hover:scale-110 active:scale-95"
          title="Bảng tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Items */}
        <div className="relative w-full h-full flex items-center justify-center preserve-3d">
          {boards.map((board, index) => {
            // Calculate distance offset from activeIndex
            let offset = index - activeIndex;
            // Support circular wrap logic if desired, or clamped offset
            if (offset < -Math.floor(boards.length / 2)) offset += boards.length;
            if (offset > Math.floor(boards.length / 2)) offset -= boards.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 3;
            if (!isVisible) return null;

            // 3D positioning calculation
            const translateX = offset * 240;
            const translateZ = -Math.abs(offset) * 160;
            const rotateY = offset * -32;
            const scale = 1 - Math.abs(offset) * 0.12;
            const opacity = 1 - Math.abs(offset) * 0.25;

            const isPortrait = board.aspectRatio === '4:5' || board.aspectRatio === '9:16';
            const isSquare = board.aspectRatio === '1:1';
            const cardWidth = isPortrait
              ? 'w-[280px] sm:w-[320px]'
              : isSquare
              ? 'w-[360px] sm:w-[420px]'
              : 'w-[420px] sm:w-[500px] md:w-[560px]';
            const cardAspect = isPortrait ? 'aspect-[4/5]' : isSquare ? 'aspect-square' : 'aspect-[16/9]';

            return (
              <div
                key={board.id}
                onClick={() => {
                  setActiveIndex(index);
                  onSelectBoard(board);
                }}
                className={`absolute ${cardWidth} ${cardAspect} preserve-3d cursor-pointer transition-all duration-500 ease-out`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex: 20 - Math.abs(offset),
                }}
              >
                {/* 3D Card Shell */}
                <div
                  className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-white ring-4 ring-white/20 shadow-white/10'
                      : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <img
                    src={board.url}
                    alt={board.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />

                  {/* GÓC TRÁI TRÊN CÙNG: Số thứ tự bảng */}
                  <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-none select-none">
                    <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">BẢNG</span>
                    <span className="text-base sm:text-lg font-black text-white font-mono leading-none">#{board.boardNumber}</span>
                  </div>

                  {/* Gradient Overlay for Titles */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-5">
                    <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                      #{index + 1} • {board.theme.toUpperCase()}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug truncate">
                      {board.title}
                    </h3>
                    <p className="text-xs text-neutral-300 truncate mt-0.5">
                      {board.subtitle || board.notes}
                    </p>

                    {isActive && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStage(board);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-neutral-200 text-neutral-950 transition-colors shadow-lg shadow-white/10"
                        >
                          <Box className="w-3.5 h-3.5" />
                          <span>Mở Sân Khấu 3D Xoay</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtle Reflection */}
                {isActive && (
                  <div
                    className="absolute top-full left-0 w-full h-full pointer-events-none rounded-2xl opacity-15 overflow-hidden"
                    style={{
                      transform: 'scaleY(-1) translateY(-6px)',
                      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 60%)',
                    }}
                  >
                    <img
                      src={board.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Index Pagination Dots */}
      <div className="relative z-10 flex items-center gap-2">
        {boards.map((board, idx) => (
          <button
            key={board.id}
            onClick={() => {
              setActiveIndex(idx);
              onSelectBoard(board);
            }}
            className={`transition-all rounded-full ${
              idx === activeIndex
                ? 'w-8 h-2.5 bg-white shadow-md shadow-white/40'
                : 'w-2.5 h-2.5 bg-neutral-700 hover:bg-neutral-500'
            }`}
            title={board.title}
          />
        ))}
      </div>
    </div>
  );
};
