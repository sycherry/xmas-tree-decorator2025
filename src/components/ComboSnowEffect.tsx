'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  fontSize: number;
}

export default function ComboSnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Create many more snowflakes for intense effect
    const flakes: Snowflake[] = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 1 + Math.random() * 2, // Much faster
      animationDelay: Math.random() * 0.5, // Start quickly
      fontSize: 12 + Math.random() * 24, // Bigger flakes
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake-combo"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            fontSize: `${flake.fontSize}px`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
