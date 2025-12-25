'use client';

import { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
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
  const [hasShownCelebration, setHasShownCelebration] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Helper function to get valid X range for a given Y within the tree triangle
  // Tree triangle in viewBox (0-100): top (50, 10), bottom-left (10, 95), bottom-right (90, 95)
  // We use percentage (0-100) for positioning
  const getTreeXRange = (yPercent: number) => {
    // Convert percentage to viewBox coordinates (viewBox is 0-100 for x, 0-120 for y)
    // The tree spans from y=10 to y=95 in viewBox, which is roughly 8% to 79% of the container
    const topY = 8;
    const bottomY = 79;
    const topX = 50;
    const bottomLeftX = 10;
    const bottomRightX = 90;

    // Clamp y to tree bounds
    const clampedY = Math.max(topY, Math.min(bottomY, yPercent));

    // Calculate progress from top to bottom (0 = top, 1 = bottom)
    const progress = (clampedY - topY) / (bottomY - topY);
    const halfWidth = progress * ((bottomRightX - bottomLeftX) / 2);

    return {
      minX: topX - halfWidth + 5, // Add padding
      maxX: topX + halfWidth - 5,
      clampedY,
    };
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && over.id === 'christmas-tree' && over.rect) {
      const ornament = ORNAMENTS.find((o) => o.id === active.id);
      if (ornament) {
        const treeRect = over.rect;

        // Get the final pointer position
        const activatorEvent = event.activatorEvent as PointerEvent;
        const delta = event.delta;

        // Calculate final position (start position + drag delta)
        const finalX = activatorEvent.clientX + delta.x;
        const finalY = activatorEvent.clientY + delta.y;

        // Convert to percentage relative to tree container
        const yPercent = ((finalY - treeRect.top) / treeRect.height) * 100;
        const xPercent = ((finalX - treeRect.left) / treeRect.width) * 100;

        // Get valid X range for this Y position within the tree triangle
        const { minX, maxX, clampedY } = getTreeXRange(yPercent);

        // Clamp X to the triangle bounds at this Y level
        const clampedX = Math.max(minX, Math.min(maxX, xPercent));

        const newOrnament: PlacedOrnament = {
          ...ornament,
          id: `${ornament.id}-${Date.now()}`,
          x: clampedX,
          y: clampedY,
        };

        setPlacedOrnaments((prev) => {
          const updated = [...prev, newOrnament];
          // Check if we've reached exactly 5 ornaments and haven't shown celebration yet
          if (updated.length === 5 && !hasShownCelebration) {
            setShowMerryChristmas(true);
            setHasShownCelebration(true);
          }
          return updated;
        });
      }
    }
  }, [hasShownCelebration]);

  const handleReset = () => {
    setPlacedOrnaments([]);
    setShowMerryChristmas(false);
    setHasShownCelebration(false);
  };

  const activeOrnament = activeId ? ORNAMENTS.find((o) => o.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main
        className={`h-screen overflow-hidden flex flex-col transition-all duration-500 ${
          isNightMode ? 'night-mode' : 'bg-gradient-to-b from-sky-200 via-sky-100 to-white'
        }`}
      >
        {/* Night mode effects */}
        {isNightMode && <Stars />}
        {isNightMode && <SnowEffect />}

        {/* Night mode toggle */}
        <NightModeToggle isNightMode={isNightMode} onToggle={() => setIsNightMode(!isNightMode)} />

        {/* Header */}
        <header className="pt-4 pb-2 text-center relative z-20 flex-shrink-0">
          <h1 className={`text-2xl md:text-4xl font-bold ${isNightMode ? 'text-white' : 'text-green-800'}`}>
            🎄 Decorate Your Christmas Tree! 🎄
          </h1>
          <p className={`mt-1 text-sm md:text-base ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Drag & drop ornaments to decorate the tree
          </p>
          <div className={`mt-1 text-base font-semibold flex items-center justify-center gap-4 ${isNightMode ? 'text-yellow-300' : 'text-red-600'}`}>
            <span>
              Ornaments: {placedOrnaments.length} / 5
              {placedOrnaments.length >= 5 && ' 🎉'}
            </span>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full shadow hover:shadow-lg transition-all duration-200"
            >
              🔄 Reset
            </button>
          </div>
        </header>

        {/* Tree container */}
        <div className="flex-1 container mx-auto px-4 relative z-20 flex flex-col overflow-hidden">
          {/* Christmas Tree */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="w-full max-w-xs md:max-w-sm h-full max-h-full">
              <ChristmasTree placedOrnaments={placedOrnaments} isNightMode={isNightMode} />
            </div>
          </div>

          {/* Ornament Palette */}
          <div className="flex-shrink-0 pb-4">
            <OrnamentPalette />
          </div>
        </div>

        {/* Merry Christmas animation */}
        {showMerryChristmas && <MerryChristmas onClose={() => setShowMerryChristmas(false)} />}

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
