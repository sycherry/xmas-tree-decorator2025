'use client';

import { useRef, useState, useEffect } from 'react';
import DraggableOrnament from './DraggableOrnament';
import { ORNAMENTS } from './types';

export default function OrnamentPalette() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const { scrollHeight, clientHeight } = scrollRef.current;
        setShowScrollbar(scrollHeight > clientHeight);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const progress = scrollTop / (scrollHeight - clientHeight);
      setScrollProgress(progress);
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-red-100 to-green-100 rounded-xl p-2 md:p-3 shadow-lg relative z-50">
      {/* Mobile/Tablet: scrollable, PC: full display */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="palette-scroll overflow-y-auto lg:overflow-visible overflow-x-hidden pr-5 lg:pr-0"
      >
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-1 md:gap-2 pb-1 lg:pb-0">
          {ORNAMENTS.map((ornament) => (
            <DraggableOrnament key={ornament.id} ornament={ornament} />
          ))}
        </div>
      </div>

      {/* Custom scroll indicator - Mobile only */}
      {showScrollbar && (
        <div className="lg:hidden absolute right-1 top-2 bottom-8 w-3 bg-green-300/60 rounded-full">
          <div
            className="absolute w-3 bg-gradient-to-b from-green-500 to-green-700 rounded-full shadow-md"
            style={{
              height: '40%',
              top: `${scrollProgress * 60}%`,
            }}
          />
        </div>
      )}

      {/* Gradient fade at bottom - only on mobile/tablet */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-100 to-transparent pointer-events-none rounded-b-xl" />
    </div>
  );
}
