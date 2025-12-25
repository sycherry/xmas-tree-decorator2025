'use client';

import { useRef } from 'react';
import DraggableOrnament from './DraggableOrnament';
import { ORNAMENTS, Ornament } from './types';

interface OrnamentPaletteProps {
  onRandom?: () => void;
  onPhotoUpload?: (ornament: Ornament) => void;
  customOrnaments?: Ornament[];
}

export default function OrnamentPalette({ onRandom, onPhotoUpload, customOrnaments = [] }: OrnamentPaletteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onPhotoUpload) return;

    // Create circular cropped image
    const imageUrl = await cropImageToCircle(file);

    const newOrnament: Ornament = {
      id: `photo-${Date.now()}`,
      emoji: '',
      name: 'Photo',
      imageUrl,
    };

    onPhotoUpload(newOrnament);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cropImageToCircle = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const size = Math.min(img.width, img.height);
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Create circular clip
          ctx.beginPath();
          ctx.arc(50, 50, 50, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          // Draw image centered and cropped
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          ctx.drawImage(img, sx, sy, size, size, 0, 0, 100, 100);

          // Add border
          ctx.strokeStyle = '#gold';
          ctx.lineWidth = 3;
          ctx.stroke();

          resolve(canvas.toDataURL('image/png'));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

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
        {/* Photo button or uploaded photo ornament */}
        {customOrnaments.length > 0 ? (
          <DraggableOrnament key={customOrnaments[0].id} ornament={customOrnaments[0]} />
        ) : (
          <button
            onClick={handlePhotoClick}
            className="flex items-center justify-center p-1 md:p-2 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
            title="Upload a photo as ornament"
          >
            <span className="text-xs md:text-sm font-bold text-white">Photo</span>
          </button>
        )}
        {/* Random button */}
        <button
          onClick={onRandom}
          className="flex items-center justify-center p-1 md:p-2 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          title="Random - Add 5 random ornaments"
        >
          <span className="text-xs md:text-sm font-bold text-white">Random</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
