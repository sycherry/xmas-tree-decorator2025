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

  // Generate tree lights for night mode
  const treeLights = isNightMode ? Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    y: 15 + (i / 20) * 70,
    color: ['#ff0000', '#ffff00', '#00ff00', '#0088ff', '#ff00ff'][i % 5],
    delay: Math.random() * 2,
  })) : [];

  return (
    <div
      ref={setNodeRef}
      className={`relative w-full max-w-md mx-auto transition-all duration-300 ${
        isOver ? 'drop-zone-active scale-105' : ''
      }`}
      style={{ aspectRatio: '3/4' }}
    >
      {/* Tree SVG */}
      <svg
        viewBox="0 0 100 120"
        className="w-full h-full absolute inset-0"
        style={{ filter: isNightMode ? 'brightness(0.8)' : 'none', zIndex: 1 }}
      >
        {/* Tree trunk */}
        <rect x="42" y="95" width="16" height="20" fill="#8B4513" />
        <rect x="40" y="110" width="20" height="8" fill="#654321" rx="2" />

        {/* Tree layers */}
        {/* Bottom layer */}
        <polygon
          points="50,10 10,95 90,95"
          fill="url(#treeGradient)"
          stroke="#1a472a"
          strokeWidth="1"
        />

        {/* Snow on tree edges */}
        <path
          d="M50,10 L25,52 L30,52 L15,75 L22,75 L10,95"
          fill="none"
          stroke="white"
          strokeWidth="2"
          opacity="0.6"
        />
        <path
          d="M50,10 L75,52 L70,52 L85,75 L78,75 L90,95"
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
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl cursor-default transition-transform hover:scale-125 drop-shadow-lg"
            style={{
              left: `${ornament.x}%`,
              top: `${ornament.y}%`,
              zIndex: 10 + index,
            }}
          >
            {ornament.emoji}
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
