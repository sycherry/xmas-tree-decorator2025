'use client';

import { useDroppable } from '@dnd-kit/core';
import { PlacedOrnament } from './types';

interface ChristmasTreeProps {
  placedOrnaments: PlacedOrnament[];
  isNightMode: boolean;
}

export default function ChristmasTree({ placedOrnaments, isNightMode }: ChristmasTreeProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'christmas-tree',
  });

  // Helper function to get valid X range for a given Y within the tree triangle
  // Tree triangle: top (50, 10), bottom-left (5, 95), bottom-right (95, 95)
  const getTreeXRange = (y: number) => {
    const topY = 10;
    const bottomY = 95;
    const topX = 50;
    const bottomLeftX = 5;
    const bottomRightX = 95;

    // Calculate progress from top to bottom (0 = top, 1 = bottom)
    const progress = (y - topY) / (bottomY - topY);
    const halfWidth = progress * ((bottomRightX - bottomLeftX) / 2);

    return {
      minX: topX - halfWidth,
      maxX: topX + halfWidth,
    };
  };

  // Generate tree lights for night mode within the triangle
  // Start below the star (star ends at y=23) to avoid overlap
  const treeLights = isNightMode ? Array.from({ length: 20 }, (_, i) => {
    const y = 25 + (i / 20) * 65; // y from 25 to 90 (below the star)
    const { minX, maxX } = getTreeXRange(y);
    const padding = 3; // Keep lights slightly inside the edge
    const x = (minX + padding) + Math.random() * (maxX - minX - padding * 2);

    return {
      id: i,
      x,
      y,
      color: ['#ff0000', '#ffff00', '#00ff00', '#0088ff', '#ff00ff'][i % 5],
      delay: Math.random() * 2,
    };
  }) : [];

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full max-w-md mx-auto transition-all duration-300 ${
        isOver ? 'drop-zone-active scale-105' : ''
      }`}
      style={{ aspectRatio: '100/115' }}
    >
      {/* Tree SVG */}
      <svg
        viewBox="0 3 100 115"
        className="w-full h-full absolute inset-0"
        style={{ filter: isNightMode ? 'brightness(0.8)' : 'none', zIndex: 1 }}
      >
        {/* Tree trunk */}
        <rect x="42" y="95" width="16" height="20" fill="#8B4513" />
        <rect x="40" y="110" width="20" height="8" fill="#654321" rx="2" />

        {/* Tree layers */}
        {/* Bottom layer */}
        <polygon
          points="50,10 5,95 95,95"
          fill="url(#treeGradient)"
          stroke="#1a472a"
          strokeWidth="1"
        />

        {/* Snow on tree edges */}
        <path
          d="M50,10 L22,52 L27,52 L10,75 L17,75 L5,95"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M50,10 L78,52 L73,52 L90,75 L83,75 L95,95"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />

        {/* Tree gradient definition */}
        <defs>
          <linearGradient id="treeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#228B22" />
            <stop offset="50%" stopColor="#1a472a" />
            <stop offset="100%" stopColor="#0d3320" />
          </linearGradient>

          {/* Glow filter for night mode */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Star on top */}
        <polygon
          points="50,5 52,12 59,12 53,16 55,23 50,19 45,23 47,16 41,12 48,12"
          fill="#FFD700"
          filter={isNightMode ? 'url(#glow)' : ''}
        />

        {/* Tree lights for night mode */}
        {treeLights.map((light) => (
          <circle
            key={light.id}
            cx={light.x}
            cy={light.y}
            r="1.5"
            fill={light.color}
            className="tree-light"
            style={{ animationDelay: `${light.delay}s` }}
            filter="url(#glow)"
          />
        ))}
      </svg>

      {/* Placed ornaments */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {placedOrnaments.map((ornament, index) => (
          <div
            key={ornament.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-default transition-transform hover:scale-125 drop-shadow-lg"
            style={{
              left: `${ornament.x}%`,
              top: `${ornament.y}%`,
              zIndex: 10 + index,
            }}
          >
            {ornament.imageUrl ? (
              <img src={ornament.imageUrl} alt={ornament.name} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-md" />
            ) : (
              <span className="text-2xl md:text-3xl">{ornament.emoji}</span>
            )}
          </div>
        ))}
      </div>

      {/* Drop indicator */}
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl animate-bounce opacity-50">
            ⬇️
          </div>
        </div>
      )}
    </div>
  );
}
