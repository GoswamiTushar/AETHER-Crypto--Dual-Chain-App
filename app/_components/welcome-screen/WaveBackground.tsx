'use client';

import React, { useRef, useEffect, useCallback } from 'react';

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    const time = Date.now() * 0.0008;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    const waveCount = 6;
    for (let i = 0; i < waveCount; i++) {
      const baseAlpha = 0.04 + i * 0.012;
      const yOffset = h * 0.2 + i * (h * 0.12);
      const amplitude = 30 + i * 12;
      const freq = 0.003 - i * 0.0003;
      const speed = time * (0.8 + i * 0.15);

      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 3) {
        // Base wave motion
        let y = yOffset
          + Math.sin(x * freq + speed) * amplitude
          + Math.sin(x * freq * 1.8 + speed * 0.7) * (amplitude * 0.4)
          + Math.cos(x * freq * 0.5 + speed * 1.3) * (amplitude * 0.3);

        // Interactive mouse distortion
        const dx = x - mx;
        const dy = y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 180);
        y += influence * influence * -50;

        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      // Gradient fill for each wave layer
      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, h);
      const hue = 220 + i * 15;
      gradient.addColorStop(0, `hsla(${hue}, 30%, 60%, ${baseAlpha * 1.8})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 20%, 40%, ${baseAlpha})`);
      gradient.addColorStop(1, `hsla(${hue}, 10%, 20%, 0)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Subtle glowing orb that follows the mouse
    if (mx > 0 && my > 0) {
      const orbGradient = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
      orbGradient.addColorStop(0, 'hsla(220, 40%, 70%, 0.08)');
      orbGradient.addColorStop(0.5, 'hsla(220, 30%, 50%, 0.03)');
      orbGradient.addColorStop(1, 'hsla(220, 20%, 30%, 0)');
      ctx.fillStyle = orbGradient;
      ctx.fillRect(0, 0, w, h);
    }

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !e.touches[0]) return;
    mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
}
