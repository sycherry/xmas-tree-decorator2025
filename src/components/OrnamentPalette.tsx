'use client';

import DraggableOrnament from './DraggableOrnament';
import { ORNAMENTS } from './types';

export default function OrnamentPalette() {
  return (
    <div className="w-full bg-gradient-to-b from-red-100 to-green-100 rounded-2xl p-4 shadow-lg">
      <h2 className="text-center text-lg md:text-xl font-bold text-green-800 mb-4">
        🎄 Drag ornaments to the tree!
      </h2>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
        {ORNAMENTS.map((ornament) => (
          <DraggableOrnament key={ornament.id} ornament={ornament} />
        ))}
      </div>
    </div>
  );
}
