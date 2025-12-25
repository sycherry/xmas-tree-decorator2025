'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Ornament } from './types';

interface DraggableOrnamentProps {
  ornament: Ornament;
}

export default function DraggableOrnament({ ornament }: DraggableOrnamentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ornament.id,
    data: ornament,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        ornament-item
        flex flex-col items-center justify-center
        p-2 md:p-3
        bg-white/80 backdrop-blur-sm
        rounded-xl shadow-md
        cursor-grab active:cursor-grabbing
        transition-all duration-200
        hover:shadow-lg hover:bg-white
        select-none touch-none
        ${isDragging ? 'opacity-50 scale-110 z-50' : ''}
      `}
      title={ornament.name}
    >
      <span className="text-2xl md:text-3xl">{ornament.emoji}</span>
      <span className="text-xs mt-1 text-gray-600 hidden md:block">{ornament.name}</span>
    </div>
  );
}
