'use client';

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import ChristmasTree from '@/components/ChristmasTree';
import OrnamentPalette from '@/components/OrnamentPalette';
import MerryChristmas from '@/components/MerryChristmas';
import NightModeToggle from '@/components/NightModeToggle';
import SnowEffect from '@/components/SnowEffect';
import Stars from '@/components/Stars';
import { PlacedOrnament, ORNAMENTS } from '@/components/types';

export default function Home() {
  const [placedOrnaments, setPlacedOrnaments] = useState<PlacedOrnament[]>([]);
  const [isNightMode, setIsNightMode] = useState(false);
  const [showMerryChristmas, setShowMerryChristmas] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Generate a random position within the tree triangle
  const getRandomTreePosition = () => {
    // Tree triangle: top at (50, 10), bottom-left at (10, 80), bottom-right at (90, 80)
    const y = 15 + Math.random() * 60; // 15% to 75% height
    // Width narrows as we go up the tree
    const widthAtY = ((y - 10) / 70) * 40; // 0 at top, 40 at bottom
    const centerX = 50;
    const x = centerX + (Math.random() - 0.5) * widthAtY * 2;
    return { x: Math.max(20, Math.min(80, x)), y };
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && over.id === 'christmas-tree') {
      const ornament = ORNAMENTS.find((o) => o.id === active.id);
      if (ornament) {
        // Place at a random position within the tree shape
        const { x, y } = getRandomTreePosition();

        const newOrnament: PlacedOrnament = {
          ...ornament,
          id: `${ornament.id}-${Date.now()}`,
          x,
          y,
        };

        setPlacedOrnaments((prev) => {
          const updated = [...prev, newOrnament];
          // Check if we've reached 5 ornaments
          if (updated.length >= 5 && !showMerryChristmas) {
            setShowMerryChristmas(true);
          }
          return updated;
        });
      }
    }
  }, [showMerryChristmas]);

  const handleReset = () => {
    setPlacedOrnaments([]);
    setShowMerryChristmas(false);
  };

  const activeOrnament = activeId ? ORNAMENTS.find((o) => o.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main
        className={`min-h-screen transition-all duration-500 ${
          isNightMode ? 'night-mode' : 'bg-gradient-to-b from-sky-200 via-sky-100 to-white'
        }`}
      >
        {/* Night mode effects */}
        {isNightMode && <Stars />}
        {isNightMode && <SnowEffect />}

        {/* Night mode toggle */}
        <NightModeToggle isNightMode={isNightMode} onToggle={() => setIsNightMode(!isNightMode)} />

        {/* Header */}
        <header className="pt-16 pb-4 text-center relative z-20">
          <h1 className={`text-3xl md:text-5xl font-bold ${isNightMode ? 'text-white' : 'text-green-800'}`}>
            🎄 Decorate Your Christmas Tree! 🎄
          </h1>
          <p className={`mt-2 text-sm md:text-base ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Drag and drop ornaments onto the tree
          </p>
          <div className={`mt-2 text-lg font-semibold ${isNightMode ? 'text-yellow-300' : 'text-red-600'}`}>
            Ornaments: {placedOrnaments.length} / 5
            {placedOrnaments.length >= 5 && ' 🎉'}
          </div>
        </header>

        {/* Tree container */}
        <div className="container mx-auto px-4 pb-8 relative z-20">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            {/* Christmas Tree */}
            <div className="w-full max-w-md lg:max-w-lg">
              <ChristmasTree placedOrnaments={placedOrnaments} isNightMode={isNightMode} />
            </div>
          </div>

          {/* Ornament Palette */}
          <div className="mt-8">
            <OrnamentPalette />
          </div>

          {/* Reset button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Merry Christmas animation */}
        {showMerryChristmas && <MerryChristmas />}

        {/* Drag overlay */}
        <DragOverlay>
          {activeOrnament ? (
            <div className="text-4xl cursor-grabbing transform scale-125">
              {activeOrnament.emoji}
            </div>
          ) : null}
        </DragOverlay>
      </main>
    </DndContext>
  );
}
