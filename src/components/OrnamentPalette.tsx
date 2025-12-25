'use client';

import DraggableOrnament from './DraggableOrnament';
import { ORNAMENTS } from './types';

export default function OrnamentPalette() {
  return (
    <div className="w-full bg-gradient-to-b from-red-100 to-green-100 rounded-xl p-2 md:p-3 shadow-lg relative z-50">
      {/* Mobile/Tablet: scrollable, PC: full display */}
      <div className="palette-scroll overflow-y-auto lg:overflow-visible overflow-x-hidden scrollbar-thin">
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-1 md:gap-2 pb-6 lg:pb-0">
          {ORNAMENTS.map((ornament) => (
            <DraggableOrnament key={ornament.id} ornament={ornament} />
          ))}
        </div>
      </div>
      {/* Gradient fade at bottom - only on mobile/tablet */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-100 to-transparent pointer-events-none rounded-b-xl" />
    </div>
  );
}
