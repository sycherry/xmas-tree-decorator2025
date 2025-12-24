'use client';

import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export default function MerryChristmas() {
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
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
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

      {/* Main message */}
      <div className="merry-christmas-animation text-center px-4">
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold rainbow-text drop-shadow-lg">
          Merry Christmas!
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl mt-4 text-white drop-shadow-md animate-bounce-slow">
          🎄 Your tree looks amazing! 🎄
        </p>
      </div>

      {/* Confetti */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`confetti-${i}`}
          className="confetti absolute text-2xl"
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
