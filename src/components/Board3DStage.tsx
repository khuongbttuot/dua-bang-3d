import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Box
} from 'lucide-react';
import { BoardImage, StudioSettings } from '../types';

interface Board3DStageProps {
  currentBoard: BoardImage;
  allBoards: BoardImage[];
  onSelectBoard: (board: BoardImage) => void;
  settings: StudioSettings;
  onUpdateSettings: (newSettings: Partial<StudioSettings>) => void;
}

export const Board3DStage: React.FC<Board3DStageProps> = ({
  currentBoard,
  allBoards,
  onSelectBoard,
  settings,
  onUpdateSettings,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentRotation, setCurrentRotation] = useState({ 
    x: settings.rotateX, 
    y: settings.rotateY 
  });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0.3 });
  const [isHovered, setIsHovered] = useState(false);

  // Sync settings when props change from external controls
  useEffect(() => {
    setCurrentRotation({ x: settings.rotateX, y: settings.rotateY });
  }, [settings.rotateX, settings.rotateY]);

  // Auto-rotation animation loop
  useEffect(() => {
    if (!settings.autoRotate) return;

    let animId: number;
    const speed = settings.autoRotateSpeed || 0.6;

    const loop = () => {
      setCurrentRotation((prev) => ({
        ...prev,
        y: (prev.y + speed) % 360,
      }));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [settings.autoRotate, settings.autoRotateSpeed]);

  const rafMoveRef = useRef<number | null>(null);

  // Mouse move for interactive tilt & light reflection shine (throttled with RAF)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const rawX = e.clientX;
      const rawY = e.clientY;

      if (rafMoveRef.current) return;
      rafMoveRef.current = requestAnimationFrame(() => {
        rafMoveRef.current = null;
        // Glare calculation
        const xPercent = (clientX / rect.width) * 100;
        const yPercent = (clientY / rect.height) * 100;
        setGlarePosition({
          x: Math.round(xPercent),
          y: Math.round(yPercent),
          opacity: 0.55,
        });

        // Interactive drag rotation
        if (isDragging) {
          const deltaX = rawX - dragStart.x;
          const deltaY = rawY - dragStart.y;
          setCurrentRotation((prev) => ({
            x: Math.max(-80, Math.min(80, prev.x - deltaY * 0.45)),
            y: (prev.y + deltaX * 0.5) % 360,
          }));
          setDragStart({ x: rawX, y: rawY });
        }
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag support for mobile / tablets
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;
      setCurrentRotation((prev) => ({
        x: Math.max(-80, Math.min(80, prev.x - deltaY * 0.4)),
        y: (prev.y + deltaX * 0.45) % 360,
      }));
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * -0.001;
    const newScale = Math.max(0.5, Math.min(1.8, settings.scale + zoomDelta));
    onUpdateSettings({ scale: parseFloat(newScale.toFixed(2)) });
  };


  // Switch to next or previous board
  const currentIndex = allBoards.findIndex((b) => b.id === currentBoard.id);
  const handlePrevBoard = () => {
    const prevIdx = (currentIndex - 1 + allBoards.length) % allBoards.length;
    onSelectBoard(allBoards[prevIdx]);
  };
  const handleNextBoard = () => {
    const nextIdx = (currentIndex + 1) % allBoards.length;
    onSelectBoard(allBoards[nextIdx]);
  };

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    const el = document.getElementById(`thumb-${currentBoard.id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentBoard.id]);

  // Spotlight color based on settings - default to crisp white/silver monochrome
  const getSpotlightGradient = () => {
    const color = settings.lightColor || '#ffffff';
    return `radial-gradient(ellipse at 50% 15%, ${color}25 0%, ${color}06 50%, transparent 80%)`;
  };

  // Floor grid class
  const getFloorClass = () => {
    switch (settings.environment) {
      case 'arena':
        return 'stage-floor-arena';
      case 'neon':
        return 'stage-floor-neon';
      case 'minimal':
        return '';
      case 'studio':
        return 'bg-gradient-to-t from-neutral-900 via-neutral-950 to-neutral-900';
      case 'cyber':
      default:
        return 'stage-floor-cyber';
    }
  };

  // Calculate 3D thickness (extrusion depth layers - capped at 4 for smooth 60fps)
  const extrusionLayers = Math.max(1, Math.min(4, Math.round(settings.depth / 4)));
  const totalDepth = settings.depth;

  const isPortrait = currentBoard.aspectRatio === '4:5' || currentBoard.aspectRatio === '9:16';
  const isSquare = currentBoard.aspectRatio === '1:1';
  const boardWidth = isPortrait
    ? 'w-[340px] sm:w-[420px]'
    : isSquare
    ? 'w-[450px] sm:w-[540px]'
    : 'w-[560px] sm:w-[720px] md:w-[840px]';
  const boardAspect = isPortrait ? 'aspect-[4/5]' : isSquare ? 'aspect-square' : 'aspect-[16/9]';

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between min-h-[calc(100vh-65px)] overflow-hidden select-none bg-[#0a0a0a]">
      {/* Dynamic Studio Background & Volumetric Light - Monochrome */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{ background: getSpotlightGradient() }}
      />

      {/* Atmospheric Particles / Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,#050505_100%)]" />

      {/* 3D VIEWPORT CONTAINER */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        onWheel={handleWheel}
        style={{ perspective: `${settings.perspective || 1400}px` }}
        className={`relative z-10 w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
      >
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrevBoard}
          className="absolute left-4 sm:left-8 z-30 p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white backdrop-blur-md shadow-2xl transition-all hover:scale-105 active:scale-95"
          title="Bảng trước đó (Phím Mũi Tên Trái)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNextBoard}
          className="absolute right-4 sm:right-8 z-30 p-3 rounded-2xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/60 text-neutral-300 hover:text-white backdrop-blur-md shadow-2xl transition-all hover:scale-105 active:scale-95"
          title="Bảng kế tiếp (Phím Mũi Tên Phải)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 3D OBJECT WRAPPER */}
        <div
          className="relative preserve-3d transition-transform duration-100 ease-out"
          style={{
            transform: `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg) rotateZ(${settings.rotateZ}deg) scale3d(${settings.scale}, ${settings.scale}, ${settings.scale})`,
          }}
        >
          {/* THE 3D BOARD CARD */}
          <div
            className={`relative ${boardWidth} ${boardAspect} preserve-3d rounded-2xl shadow-2xl transition-shadow duration-300`}
            style={{
              boxShadow: `0 35px 70px -15px rgba(0,0,0,0.95), 0 0 50px rgba(255,255,255,0.12)`,
            }}
          >
            {/* 3D Extrusion Side Layers (Tangible physical thickness - Monochrome Gray/Black/White) */}
            {settings.depth > 0 &&
              Array.from({ length: extrusionLayers }).map((_, index) => {
                const zOffset = -((index + 1) * (totalDepth / extrusionLayers));
                const brightness = 0.25 + (index / extrusionLayers) * 0.45;
                return (
                  <div
                    key={`extrusion-${index}`}
                    className="absolute inset-0 rounded-2xl pointer-events-none border border-neutral-700/50"
                    style={{
                      transform: `translateZ(${zOffset}px)`,
                      backgroundColor: `rgba(32, 32, 32, ${brightness})`,
                      boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.1)`,
                    }}
                  />
                );
              })}

            {/* BACK FACE: Also displays the exact Board Image (orientated correctly when turned around) */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden preserve-3d backface-hidden bg-neutral-900 border-2 border-white/30"
              style={{
                transform: `rotateY(180deg) translateZ(${Math.max(1, settings.depth)}px)`,
              }}
            >
              {/* Image on the back face */}
              <img
                src={currentBoard.url}
                alt={currentBoard.title}
                className="w-full h-full object-cover object-center pointer-events-none select-none"
                loading="eager"
              />

              {/* GÓC TRÁI TRÊN CÙNG: Số thứ tự bảng */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-none select-none">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-400 uppercase">BẢNG</span>
                <span className="text-base sm:text-2xl font-black text-white font-mono tracking-tight">#{currentBoard.boardNumber}</span>
              </div>

              {/* Dynamic Acrylic Specular Glare */}
              {settings.reflection && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
                  style={{
                    opacity: isHovered ? glarePosition.opacity : 0.2,
                    background: `radial-gradient(circle at ${100 - glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 30%, transparent 65%)`,
                  }}
                />
              )}

              {/* Polished Glass Bevel Edge Highlight */}
              {settings.bevel && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-white/30" />
              )}
            </div>

            {/* FRONT FACE: High-Res Image Board */}
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden preserve-3d backface-hidden bg-neutral-900 border-2 border-white/30"
              style={{
                transform: 'translateZ(0px)',
              }}
            >
              {/* Actual Image */}
              <img
                src={currentBoard.url}
                alt={currentBoard.title}
                className="w-full h-full object-cover object-center pointer-events-none select-none"
                loading="eager"
              />

              {/* GÓC TRÁI TRÊN CÙNG: Số thứ tự bảng */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-amber-400/80 shadow-[0_4px_20px_rgba(0,0,0,0.8)] pointer-events-none select-none">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-400 uppercase">BẢNG</span>
                <span className="text-base sm:text-2xl font-black text-white font-mono tracking-tight">#{currentBoard.boardNumber}</span>
              </div>

              {/* Dynamic Acrylic Specular Glare / Light Sheen */}
              {settings.reflection && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
                  style={{
                    opacity: isHovered ? glarePosition.opacity : 0.2,
                    background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 30%, transparent 65%)`,
                  }}
                />
              )}

              {/* Optional Holographic Rainbow Foil Layer */}
              {settings.holographic && (
                <div className="absolute inset-0 pointer-events-none holo-gradient animate-[holo-shimmer_6s_ease_infinite]" />
              )}

              {/* Polished Glass Bevel Edge Highlight */}
              {settings.bevel && (
                <div className="absolute inset-0 rounded-2xl pointer-events-none ring-1 ring-inset ring-white/30" />
              )}
            </div>
          </div>

          {/* 3D GROUND / STAGE FLOOR & MIRROR REFLECTION */}
          {settings.floorGrid && (
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 w-[1200px] h-[700px] pointer-events-none opacity-30 ${getFloorClass()}`}
              style={{
                transform: `rotateX(90deg) translateZ(-40px)`,
                maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 70%)',
              }}
            />
          )}

          {/* Inverted Floor Mirror Reflection */}
          {settings.reflection && (
            <div
              className={`absolute top-full left-0 ${boardWidth} ${boardAspect} pointer-events-none preserve-3d overflow-hidden rounded-2xl opacity-20`}
              style={{
                transform: `scaleY(-1) translateY(-10px)`,
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 75%)',
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 75%)',
                filter: 'blur(2px)',
              }}
            >
              <img
                src={currentBoard.url}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}

          {/* Ambient Ground Contact Shadow */}
          <div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[90%] h-14 bg-black/90 rounded-full blur-2xl pointer-events-none"
            style={{
              transform: `scale(${settings.scale * 1.1})`,
            }}
          />
        </div>
      </div>

      {/* STAGE BOTTOM THUMBNAIL CAROUSEL */}
      <div className="relative z-20 w-full max-w-7xl px-4 pb-3 flex flex-col items-center">
        {/* Quick status bar */}
        <div className="flex items-center justify-between w-full max-w-5xl px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-300 bg-neutral-900/90 border border-neutral-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
              <span>Đang xem:</span>
              <strong className="text-amber-400 font-bold">Bảng #{currentBoard.boardNumber}</strong>
              <span className="text-neutral-500">({currentIndex + 1} / {allBoards.length})</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const el = document.getElementById('thumbnail-scroll-container');
                if (el) el.scrollBy({ left: -280, behavior: 'smooth' });
              }}
              className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Cuộn sang trái"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('thumbnail-scroll-container');
                if (el) el.scrollBy({ left: 280, behavior: 'smooth' });
              }}
              className="p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              title="Cuộn sang phải"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Strip */}
        <div className="w-full max-w-5xl relative">
          <div
            id="thumbnail-scroll-container"
            className="w-full flex items-center justify-start gap-2.5 overflow-x-auto py-1.5 px-2 scroll-smooth scrollbar-thin scrollbar-thumb-neutral-700"
          >
            {allBoards.map((board) => {
              const isSelected = board.id === currentBoard.id;
              return (
                <button
                  key={board.id}
                  id={`thumb-${board.id}`}
                  onClick={() => onSelectBoard(board)}
                  className={`group relative shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-amber-400 scale-105 shadow-xl shadow-amber-400/20 ring-2 ring-amber-400/80 opacity-100'
                      : 'border-neutral-800 hover:border-neutral-600 opacity-60 hover:opacity-100'
                  }`}
                  style={{ width: '96px', height: '56px' }}
                  title={`Bảng #${board.boardNumber}`}
                >
                  <img
                    src={board.url}
                    alt={board.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  {/* Góc trái trên cùng badge trên thumbnail */}
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/85 border border-amber-400/60 text-[10px] font-black text-amber-300 font-mono shadow leading-none">
                    #{board.boardNumber}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] font-semibold text-white truncate w-full text-left">
                      Bảng #{board.boardNumber}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
