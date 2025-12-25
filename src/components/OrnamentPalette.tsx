'use client';

import { useRef, useState } from 'react';
import DraggableOrnament from './DraggableOrnament';
import ImageCropModal from './ImageCropModal';
import { ORNAMENTS, Ornament } from './types';

interface OrnamentPaletteProps {
  onRandom?: () => void;
  onPhotoUpload?: (ornament: Ornament) => void;
  customOrnaments?: Ornament[];
  gameFontActive?: boolean;
}

export default function OrnamentPalette({ onRandom, onPhotoUpload, customOrnaments = [], gameFontActive = false }: OrnamentPaletteProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read file and show crop modal
    const reader = new FileReader();
    reader.onload = (event) => {
      setTempImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    if (!onPhotoUpload) return;

    const newOrnament: Ornament = {
      id: `photo-${Date.now()}`,
      emoji: '',
      name: 'Photo',
      imageUrl: croppedImageUrl,
    };

    onPhotoUpload(newOrnament);
    setTempImageUrl(null);
  };

  const handleCropCancel = () => {
    setTempImageUrl(null);
  };

  return (
    <div className={`w-full rounded-xl p-2 md:p-3 shadow-lg relative z-50 ${gameFontActive ? 'bg-black border-2 border-green-500' : 'bg-gradient-to-b from-red-100 to-green-100'}`}>
      <p className={`text-xs text-center mb-2 ${gameFontActive ? 'font-mono text-green-400' : 'text-gray-500'}`} style={gameFontActive ? { textShadow: '0 0 5px rgba(0, 255, 0, 0.6)' } : {}}>
        <span className="hidden md:inline">{gameFontActive ? '> DRAG & DROP ITEMS <' : 'Drag & drop ornaments onto the tree'}</span>
        <span className="md:hidden">{gameFontActive ? '> HOLD & DRAG <' : 'Hold & drag ornaments onto the tree'}</span>
      </p>
      <div className="grid grid-cols-4 lg:grid-cols-6 gap-1 md:gap-2">
        {ORNAMENTS.map((ornament) => (
          <DraggableOrnament key={ornament.id} ornament={ornament} />
        ))}
        {/* Photo button or uploaded photo ornament */}
        {customOrnaments.length > 0 ? (
          <DraggableOrnament key={customOrnaments[0].id} ornament={customOrnaments[0]} />
        ) : (
          <button
            onClick={handlePhotoClick}
            className={`flex items-center justify-center p-1 md:p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${gameFontActive ? 'bg-green-700 hover:bg-green-600 font-mono border border-green-400' : 'bg-gradient-to-br from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500'}`}
            title="Upload a photo as ornament"
            style={gameFontActive ? { textShadow: '0 0 5px rgba(0, 255, 0, 0.8)' } : {}}
          >
            <span className="text-xs md:text-sm font-bold text-white">{gameFontActive ? '[PHOTO]' : 'Photo'}</span>
          </button>
        )}
        {/* Random button */}
        <button
          onClick={onRandom}
          className={`flex items-center justify-center p-1 md:p-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${gameFontActive ? 'bg-green-700 hover:bg-green-600 font-mono border border-green-400' : 'bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500'}`}
          title="Random - Add 5 random ornaments"
          style={gameFontActive ? { textShadow: '0 0 5px rgba(0, 255, 0, 0.8)' } : {}}
        >
          <span className="text-xs md:text-sm font-bold text-white">{gameFontActive ? '[RANDOM]' : 'Random'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Crop modal */}
      {tempImageUrl && (
        <ImageCropModal
          imageUrl={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
