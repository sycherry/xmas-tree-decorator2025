'use client';

import DraggableOrnament from './DraggableOrnament';
import { ORNAMENTS } from './types';

interface OrnamentPaletteProps {
  onRandom?: () => void;
}

export default function OrnamentPalette({ onRandom }: OrnamentPaletteProps) {
  return (
    <div className="w-full bg-gradient-to-b from-red-100 to-green-100 rounded-xl p-2 md:p-3 shadow-lg relative z-50">
      <p className="text-xs text-gray-500 text-center mb-2">
        <span className="hidden md:inline">Drag & drop ornaments onto the tree</span>
        <span className="md:hidden">Hold & drag ornaments onto the tree</span>
      </p>
      <div className="grid grid-cols-5 lg:grid-cols-10 gap-1 md:gap-2">
        {ORNAMENTS.map((ornament) => (
          <DraggableOrnament key={ornament.id} ornament={ornament} />
        ))}
        {/* Random button */}
        <button
          onClick={onRandom}
          className="flex items-center justify-center p-1 md:p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          title="Random - Add 5 random ornaments"
        >
          <span className="text-xs md:text-sm font-bold text-white">Random</span>
        </button>
      </div>
    </div>
  );
}
