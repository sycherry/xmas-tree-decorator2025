'use client';

import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface MerryChristmasProps {
  onClose: () => void;
}

export default function MerryChristmas({ onClose }: MerryChristmasProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Generate sparkles
    const newSparkles: Sparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 20,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Modal */}
      <div className="relative merry-christmas-animation bg-gradient-to-b from-red-600 to-green-700 rounded-3xl p-8 md:p-12 shadow-2xl mx-4 max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white text-xl transition-all"
        >
          ✕
        </button>

        {/* Main message */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold rainbow-text drop-shadow-lg">
            Merry Christmas!
          </h1>
          <p className="text-lg md:text-xl mt-4 text-white drop-shadow-md">
            🎄 Your tree looks amazing! 🎄
          </p>
        </div>
      </div>

      {/* Confetti */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`confetti-${i}`}
          className="confetti absolute text-2xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          {['🎊', '🎉', '⭐', '🌟', '✨'][i % 5]}
        </div>
      ))}
    </div>
  );
}
