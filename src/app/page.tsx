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
import { PlacedOrnament, ORNAMENTS, Ornament } from '@/components/types';

export default function Home() {
  const [placedOrnaments, setPlacedOrnaments] = useState<PlacedOrnament[]>([]);
  const [isNightMode, setIsNightMode] = useState(true);
  const [showMerryChristmas, setShowMerryChristmas] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [treeImage, setTreeImage] = useState<string | null>(null);
  const [customOrnaments, setCustomOrnaments] = useState<Ornament[]>([]);
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
      const ornament = ORNAMENTS.find((o) => o.id === active.id) || customOrnaments.find((o) => o.id === active.id);
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
  }, [customOrnaments]);

  const handleReset = () => {
    setPlacedOrnaments([]);
    setShowMerryChristmas(false);
    setTreeImage(null);
    setCustomOrnaments([]);
  };

  const handlePhotoUpload = (ornament: Ornament) => {
    setCustomOrnaments((prev) => [...prev, ornament]);
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

  const activeOrnament = activeId ? (ORNAMENTS.find((o) => o.id === activeId) || customOrnaments.find((o) => o.id === activeId)) : null;

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

        {/* Snow ground for day mode - fixed at bottom */}
        {!isNightMode && (
          <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-10" style={{ height: '700px' }}>
            <svg
              viewBox="0 0 400 700"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              {/* Back layer - darker blue */}
              <ellipse cx="80" cy="700" rx="400" ry="400" fill="#7dd3fc" />
              <ellipse cx="320" cy="700" rx="380" ry="360" fill="#7dd3fc" />
              {/* Middle layer - lighter blue */}
              <ellipse cx="50" cy="700" rx="350" ry="300" fill="#bae6fd" />
              <ellipse cx="350" cy="700" rx="330" ry="280" fill="#bae6fd" />
              <ellipse cx="200" cy="700" rx="380" ry="260" fill="#bae6fd" />
              {/* Front layer - white */}
              <ellipse cx="0" cy="700" rx="320" ry="200" fill="white" />
              <ellipse cx="200" cy="700" rx="400" ry="180" fill="white" />
              <ellipse cx="400" cy="700" rx="340" ry="190" fill="white" />
            </svg>
          </div>
        )}

        {/* Tree container */}
        <div className="flex-1 container mx-auto px-4 relative z-20 flex flex-col overflow-hidden">
          {/* Christmas Tree */}
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="relative w-full max-w-xs md:max-w-sm" style={{ aspectRatio: '100/115' }}>
              <div ref={treeContainerRef} className="w-full h-full">
                <ChristmasTree placedOrnaments={placedOrnaments} isNightMode={isNightMode} />
              </div>
            </div>
          </div>
        </div>

        {/* Ornament Palette - Full width on PC */}
        <div className="flex-shrink-0 pb-4 px-2 lg:px-4 w-full relative z-20 safe-area-bottom">
          <OrnamentPalette onRandom={handleRandom} onPhotoUpload={handlePhotoUpload} customOrnaments={customOrnaments} />
        </div>

        {/* Merry Christmas animation */}
        {showMerryChristmas && <MerryChristmas onClose={() => setShowMerryChristmas(false)} treeImage={treeImage} treeRef={treeContainerRef} />}

        {/* Drag overlay */}
        <DragOverlay>
          {activeOrnament ? (
            <div className="cursor-grabbing transform scale-125">
              {activeOrnament.imageUrl ? (
                <img src={activeOrnament.imageUrl} alt={activeOrnament.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-lg" />
              ) : (
                <span className="text-4xl">{activeOrnament.emoji}</span>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </main>
    </DndContext>
  );
}
