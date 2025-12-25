'use client';

import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface MerryChristmasProps {
  onClose: () => void;
  treeImage: string | null;
}

export default function MerryChristmas({ onClose, treeImage }: MerryChristmasProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const handleShare = async () => {
    if (!treeImage) return;

    try {
      // Convert base64 to blob
      const response = await fetch(treeImage);
      const blob = await response.blob();
      const file = new File([blob], 'my-christmas-tree.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Christmas Tree',
          text: 'Check out my decorated Christmas tree! 🎄',
          files: [file],
        });
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.href = treeImage;
        link.download = 'my-christmas-tree.png';
        link.click();
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  };

  useEffect(() => {
    // Generate sparkles
    const newSparkles: Sparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 20,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      {/* Backdrop - light blur to show tree */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sparkle effects */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            fontSize: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Modal */}
      <div className="relative merry-christmas-animation bg-gradient-to-b from-red-600 to-green-700 rounded-3xl p-8 md:p-12 shadow-2xl mx-4 max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white text-xl transition-all"
        >
          ✕
        </button>

        {/* Tree screenshot */}
        {treeImage && (
          <div className="flex justify-center mb-4">
            <img
              src={treeImage}
              alt="Your Christmas Tree"
              className="max-h-48 md:max-h-64 rounded-lg shadow-lg border-4 border-white/30"
            />
          </div>
        )}

        {/* Main message */}
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold rainbow-text drop-shadow-lg">
            Merry Christmas!
          </h1>
          <p className="text-lg md:text-xl mt-4 text-white drop-shadow-md">
            🎄 Your tree looks amazing! 🎄
          </p>

          {/* Share button */}
          {treeImage && (
            <button
              onClick={handleShare}
              className="mt-6 px-6 py-3 bg-white/90 hover:bg-white text-green-700 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              {canShare ? '📤 Share' : '💾 Download'}
            </button>
          )}
        </div>
      </div>

      {/* Confetti */}
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={`confetti-${i}`}
          className="confetti absolute text-2xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          {['🎊', '🎉', '⭐', '🌟', '✨'][i % 5]}
        </div>
      ))}
    </div>
  );
}
