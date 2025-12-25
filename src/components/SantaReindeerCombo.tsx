'use client';

import { useEffect, useState } from 'react';

export default function SantaReindeerCombo() {
  const [position, setPosition] = useState(-20);

  useEffect(() => {
    // Animate santa on reindeer flying across the screen
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev > 120) return -20;
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* Santa on Reindeer */}
      <div
        className="absolute text-6xl md:text-8xl transition-transform"
        style={{
          left: `${position}%`,
          top: '20%',
          transform: 'scaleX(-1)',
          filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
        }}
      >
        <span className="relative">
          <span className="absolute -left-8 md:-left-12 -top-4 md:-top-6">🎅</span>
          <span>🦌</span>
        </span>
      </div>

      {/* Sparkle trail */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute text-2xl md:text-3xl animate-pulse"
          style={{
            left: `${position - 5 - i * 4}%`,
            top: `${22 + Math.sin(i) * 3}%`,
            opacity: 1 - i * 0.1,
            animationDelay: `${i * 0.1}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
}
