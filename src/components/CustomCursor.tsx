import React, { useEffect, useRef, useState } from 'react';
import rilakkumaCursor from '../assets/9211-rilakkuma.gif';

/**
 * CustomCursor - Emulates the cursor and trailing canvas ribbon effect from duongtran.xyz
 * Features:
 * 1. Animated Rilakkuma GIF cursor icon (/assets/images/9211-rilakkuma.gif)
 * 2. Multi-strand spring physics ribbon trail on an interactive overlay canvas
 * 3. Interactive click reaction (scale bounce & subtle ring ripple)
 * 4. Responsive hover states over interactive elements (buttons, links, inputs)
 * 5. Automatic fallback for touch screens (pointer: coarse)
 */
export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const cursor = cursorRef.current;
    const canvas = canvasRef.current;
    if (!cursor || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let frameId: number | null = null;

    // Canvas resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Multi-strand physics spring trail configuration from duongtran.xyz
    const settings = {
      friction: 0.5,
      trails: 20,
      size: 50,
      dampening: 0.2,
      tension: 0.98,
      color: '#737373',
    };

    const pointer = { x: cursorX, y: cursorY };

    class Trail {
      spring: number;
      friction: number;
      nodes: Array<{ x: number; y: number; vx: number; vy: number }>;

      constructor(index: number) {
        this.spring = 0.4 + (index / settings.trails) * 0.025 + 0.1 * Math.random() - 0.02;
        this.friction = settings.friction + 0.01 * Math.random() - 0.002;
        this.nodes = Array.from({ length: settings.size }, () => ({
          x: pointer.x,
          y: pointer.y,
          vx: 0,
          vy: 0,
        }));
      }

      update() {
        let spring = this.spring;
        let node = this.nodes[0];
        node.vx += (pointer.x - node.x) * spring;
        node.vy += (pointer.y - node.y) * spring;

        for (let i = 0; i < this.nodes.length; i++) {
          node = this.nodes[i];
          if (i > 0) {
            const prev = this.nodes[i - 1];
            node.vx += (prev.x - node.x) * spring;
            node.vy += (prev.y - node.y) * spring;
            node.vx += prev.vx * settings.dampening;
            node.vy += prev.vy * settings.dampening;
          }
          node.vx *= this.friction;
          node.vy *= this.friction;
          node.x += node.vx;
          node.y += node.vy;
          spring *= settings.tension;
        }
      }

      draw() {
        if (!ctx) return;
        let x = this.nodes[0].x;
        let y = this.nodes[0].y;
        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let i = 1; i < this.nodes.length - 2; i++) {
          const node = this.nodes[i];
          const next = this.nodes[i + 1];
          x = (node.x + next.x) * 0.5;
          y = (node.y + next.y) * 0.5;
          ctx.quadraticCurveTo(node.x, node.y, x, y);
        }

        const penultimate = this.nodes[this.nodes.length - 2];
        const last = this.nodes[this.nodes.length - 1];
        ctx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
        ctx.stroke();
        ctx.closePath();
      }
    }

    const trails: Trail[] = [];
    for (let i = 0; i < settings.trails; i++) {
      trails.push(new Trail(i));
    }

    // Animation loop for ribbon trail
    let loopRaf: number;
    const loop = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = settings.color;
      ctx.globalAlpha = 0.22;
      ctx.lineWidth = 1;

      trails.forEach((trail) => {
        trail.update();
        trail.draw();
      });

      loopRaf = requestAnimationFrame(loop);
    };
    loopRaf = requestAnimationFrame(loop);

    // Mouse movement handler
    const renderCursorPosition = () => {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      frameId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      pointer.x = cursorX;
      pointer.y = cursorY;

      cursor.style.opacity = '1';

      if (!frameId) {
        frameId = requestAnimationFrame(renderCursorPosition);
      }

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, select, textarea, [role="button"], [tabindex], label');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-4), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(loopRaf);
      if (frameId) cancelAnimationFrame(frameId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Background Trail Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[999990] hidden sm:block"
        style={{ pointerEvents: 'none' }}
      />

      {/* Click Ripples */}
      <div className="pointer-events-none fixed inset-0 z-[999995] overflow-hidden">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full border border-white/40 animate-ping pointer-events-none"
            style={{
              left: ripple.x - 12,
              top: ripple.y - 12,
              width: 24,
              height: 24,
              animationDuration: '600ms',
            }}
          />
        ))}
      </div>

      {/* Main Animated GIF Cursor (Identical to duongtran.xyz) */}
      <img
        ref={cursorRef}
        id="custom-gif-cursor"
        src={rilakkumaCursor}
        alt=""
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 w-[42px] h-[42px] object-contain z-[9999999] opacity-0 will-change-transform hidden sm:block select-none"
        style={{
          transform: `translate3d(-8px, -6px, 0) scale(${
            isClicking ? 0.88 : isHovered ? 1.2 : 1
          }) rotate(${isClicking ? -10 : isHovered ? 5 : 0}deg)`,
          transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease',
        }}
      />
    </>
  );
};
