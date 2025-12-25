'use client';

import { useEffect, useState } from 'react';

export default function SantaWithGift() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`fixed top-28 md:top-32 right-4 md:right-1/4 z-40 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
    >
      <div className="relative animate-bounce" style={{ animationDuration: '2s' }}>
        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-yellow-300 opacity-50 rounded-full scale-150" />

        {/* Santa with gift */}
        <div className="relative text-6xl md:text-8xl flex items-end">
          <span className="drop-shadow-lg">🎅</span>
          <span className="absolute -right-2 md:-right-4 bottom-2 md:bottom-4 text-4xl md:text-5xl animate-pulse">🎁</span>
        </div>

        {/* Sparkles */}
        <div className="absolute -top-2 -left-2 text-xl animate-ping">✨</div>
        <div className="absolute -top-1 -right-1 text-lg animate-ping" style={{ animationDelay: '0.5s' }}>✨</div>
        <div className="absolute -bottom-1 left-1/2 text-xl animate-ping" style={{ animationDelay: '1s' }}>✨</div>
      </div>
    </div>
  );
}
