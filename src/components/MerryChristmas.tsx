'use client';

import { useEffect, useState, RefObject } from 'react';
import html2canvas from 'html2canvas';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

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
  treeRef: RefObject<HTMLDivElement | null>;
}

export default function MerryChristmas({ onClose, treeImage, treeRef }: MerryChristmasProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [canShare, setCanShare] = useState(false);
  const [isCreatingGif, setIsCreatingGif] = useState(false);

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

  const createAnimatedGif = async () => {
    if (!treeRef.current) return;
    setIsCreatingGif(true);

    try {
      const frameCount = 8;
      const frameDelay = 200; // ms between frames
      const width = 300;
      const height = 400;

      const gif = GIFEncoder();

      // Capture the tree once
      const treeCanvas = await html2canvas(treeRef.current, {
        backgroundColor: null,
        scale: 1,
      });

      // Create frames with sparkle animation
      for (let i = 0; i < frameCount; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        // Draw background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);

        // Draw tree centered
        const scale = Math.min(width / treeCanvas.width, height / treeCanvas.height) * 0.9;
        const x = (width - treeCanvas.width * scale) / 2;
        const y = (height - treeCanvas.height * scale) / 2;
        ctx.drawImage(treeCanvas, x, y, treeCanvas.width * scale, treeCanvas.height * scale);

        // Draw sparkles with animation
        const sparkleEmojis = ['✨', '⭐', '🌟', '💫'];
        ctx.font = '16px serif';
        for (let j = 0; j < 12; j++) {
          const sparkleX = 20 + (j * 23) % (width - 40);
          const sparkleY = 20 + ((j * 37 + i * 50) % (height - 40));
          const opacity = 0.5 + Math.sin((i + j) * 0.8) * 0.5;
          ctx.globalAlpha = opacity;
          ctx.fillText(sparkleEmojis[j % 4], sparkleX, sparkleY);
        }
        ctx.globalAlpha = 1;

        // Add "Merry Christmas" text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Merry Christmas!', width / 2, height - 30);

        // Convert to indexed color and add frame
        const imageData = ctx.getImageData(0, 0, width, height);
        const palette = quantize(imageData.data, 256);
        const index = applyPalette(imageData.data, palette);
        gif.writeFrame(index, width, height, { palette, delay: frameDelay });
      }

      gif.finish();
      const buffer = gif.bytes();
      const blob = new Blob([new Uint8Array(buffer)], { type: 'image/gif' });

      // Share or download
      if (navigator.share && navigator.canShare({ files: [new File([blob], 'tree.gif', { type: 'image/gif' })] })) {
        const file = new File([blob], 'my-christmas-tree.gif', { type: 'image/gif' });
        await navigator.share({
          title: 'My Christmas Tree',
          text: 'Check out my decorated Christmas tree! 🎄',
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'my-christmas-tree.gif';
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('GIF creation failed:', error);
    } finally {
      setIsCreatingGif(false);
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

          {/* Share buttons */}
          {treeImage && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-white/90 hover:bg-white text-green-700 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {canShare ? '📤 Share Image' : '💾 Download Image'}
              </button>
              <button
                onClick={createAnimatedGif}
                disabled={isCreatingGif}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isCreatingGif ? '⏳ Creating...' : '🎬 Share as GIF'}
              </button>
            </div>
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
