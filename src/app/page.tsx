'use client';

import { useState, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [treeImage, setTreeImage] = useState<string | null>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);

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

        setPlacedOrnaments((prev) => [...prev, newOrnament]);
      }
    }
  }, []);

  const handleReset = () => {
    setPlacedOrnaments([]);
    setShowMerryChristmas(false);
    setTreeImage(null);
  };

  const handleComplete = async () => {
    if (treeContainerRef.current) {
      const canvas = await html2canvas(treeContainerRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const imageData = canvas.toDataURL('image/png');
      setTreeImage(imageData);
    }
    setShowMerryChristmas(true);
  };

  const handleRandom = () => {
    const newOrnaments: PlacedOrnament[] = [];

    for (let i = 0; i < 5; i++) {
      // Pick a random ornament
      const randomOrnament = ORNAMENTS[Math.floor(Math.random() * ORNAMENTS.length)];

      // Generate random position within tree bounds
      const yPercent = 15 + Math.random() * 60; // y from 15% to 75%
      const { minX, maxX } = getTreeXRange(yPercent);
      const xPercent = minX + Math.random() * (maxX - minX);

      newOrnaments.push({
        ...randomOrnament,
        id: `${randomOrnament.id}-${Date.now()}-${i}`,
        x: xPercent,
        y: yPercent,
      });
    }

    setPlacedOrnaments((prev) => [...prev, ...newOrnaments]);
  };

  const activeOrnament = activeId ? ORNAMENTS.find((o) => o.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <main
        className={`h-dvh overflow-hidden flex flex-col transition-all duration-500 ${
          isNightMode ? 'night-mode' : 'bg-gradient-to-b from-sky-200 via-sky-100 to-white'
        }`}
      >
        {/* Night mode effects */}
        {isNightMode && <Stars />}
        {isNightMode && <SnowEffect />}

        {/* Night mode toggle */}
        <NightModeToggle isNightMode={isNightMode} onToggle={() => setIsNightMode(!isNightMode)} />

        {/* Header */}
        <header className="pt-4 text-center relative z-20 flex-shrink-0">
          <h1 className={`text-2xl md:text-4xl font-bold ${isNightMode ? 'text-white' : 'text-green-800'}`}>
            🎄 Decorate Your <span className="hidden md:inline">Christmas </span>Tree! 🎄
          </h1>
          <p className={`mt-3 text-sm md:text-base ${isNightMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No tree at home? Get into the Christmas spirit online!
          </p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-full shadow hover:shadow-lg transition-all duration-200"
            >
              🔄 Reset
            </button>
            <button
              onClick={handleComplete}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-full shadow hover:shadow-lg transition-all duration-200"
            >
              🎄 Complete!
            </button>
          </div>
        </header>

        {/* Tree container */}
        <div className="flex-1 container mx-auto px-4 relative z-20 flex flex-col overflow-hidden">
          {/* Christmas Tree */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div ref={treeContainerRef} className="w-full max-w-xs md:max-w-sm h-full max-h-full">
              <ChristmasTree placedOrnaments={placedOrnaments} isNightMode={isNightMode} />
            </div>
          </div>
        </div>

        {/* Ornament Palette - Full width on PC */}
        <div className="flex-shrink-0 pb-4 px-2 lg:px-4 w-full relative z-20 safe-area-bottom">
          <OrnamentPalette onRandom={handleRandom} />
        </div>

        {/* Merry Christmas animation */}
        {showMerryChristmas && <MerryChristmas onClose={() => setShowMerryChristmas(false)} treeImage={treeImage} />}

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
