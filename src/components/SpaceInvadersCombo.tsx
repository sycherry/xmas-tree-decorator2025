'use client';

import { useEffect, useState } from 'react';

interface Invader {
  id: number;
  x: number;
  y: number;
  emoji: string;
  direction: number;
}

export default function SpaceInvadersCombo() {
  const [invaders, setInvaders] = useState<Invader[]>([]);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    // Create invader grid
    const invaderEmojis = ['👾', '👽', '🤖', '🛸'];
    const initialInvaders: Invader[] = [];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        initialInvaders.push({
          id: row * 8 + col,
          x: 10 + col * 10,
          y: 5 + row * 8,
          emoji: invaderEmojis[row % invaderEmojis.length],
          direction: 1,
        });
      }
    }
    setInvaders(initialInvaders);

    // Animate invaders moving side to side and down
    const interval = setInterval(() => {
      setFrame((f) => f + 1);
      setInvaders((prev) => {
        const rightMost = Math.max(...prev.map((i) => i.x));
        const leftMost = Math.min(...prev.map((i) => i.x));
        const currentDirection = prev[0]?.direction || 1;

        let newDirection = currentDirection;
        let moveDown = false;

        if (rightMost >= 85 && currentDirection === 1) {
          newDirection = -1;
          moveDown = true;
        } else if (leftMost <= 5 && currentDirection === -1) {
          newDirection = 1;
          moveDown = true;
        }

        return prev.map((invader) => ({
          ...invader,
          x: invader.x + newDirection * 2,
          y: moveDown ? invader.y + 5 : invader.y,
          direction: newDirection,
        }));
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* Scanline effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
        }}
      />

      {/* Invaders */}
      {invaders.map((invader) => (
        <div
          key={invader.id}
          className="absolute transition-all duration-200"
          style={{
            left: `${invader.x}%`,
            top: `${invader.y}%`,
            fontSize: '2rem',
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))',
            transform: frame % 2 === 0 ? 'scaleX(1)' : 'scaleX(-1)',
          }}
        >
          {invader.emoji}
        </div>
      ))}

      {/* Player ship at bottom */}
      <div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-4xl animate-pulse"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.8))',
        }}
      >
        🎮
      </div>
    </div>
  );
}
