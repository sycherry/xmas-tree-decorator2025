'use client';

import DraggableOrnament from './DraggableOrnament';
import { ORNAMENTS } from './types';

export default function OrnamentPalette() {
  return (
    <div className="w-full bg-gradient-to-b from-red-100 to-green-100 rounded-xl p-2 md:p-3 shadow-lg relative z-50">
      <div className="grid grid-cols-10 gap-1 md:gap-2">
        {ORNAMENTS.map((ornament) => (
          <DraggableOrnament key={ornament.id} ornament={ornament} />
        ))}
      </div>
    </div>
  );
}
