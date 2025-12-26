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
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    // Check if mobile size (width < 768px = share, otherwise download)
    const checkMobile = () => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      setCanShare(isMobile && !!navigator.share);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Create image with text overlay
  const createImageWithText = async (): Promise<string | null> => {
    if (!treeImage) return null;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(treeImage);
          return;
        }

        // Draw night sky gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, img.height);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, img.width, img.height);

        // Draw some stars
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * img.width;
          const y = Math.random() * img.height * 0.6;
          const size = Math.random() * 2 + 1;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw the tree image
        ctx.drawImage(img, 0, 0);

        // Draw the message text if exists
        if (messageText.trim()) {
          const padding = 12;
          const fontSize = Math.max(14, img.width / 18);
          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.textAlign = 'center';

          const text = messageText.trim();
          const textWidth = ctx.measureText(text).width;
          const lineHeight = fontSize * 1.4;

          // Draw semi-transparent background
          const bgX = (img.width - textWidth) / 2 - padding;
          const bgY = img.height * 0.88 - padding;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.roundRect(bgX, bgY, textWidth + padding * 2, lineHeight + padding, 8);
          ctx.fill();

          // Draw text
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          const y = img.height * 0.88 + lineHeight * 0.8;
          ctx.strokeText(text, img.width / 2, y);
          ctx.fillText(text, img.width / 2, y);
        }

        resolve(canvas.toDataURL('image/png'));
      };
      img.src = treeImage;
    });
  };

  const handleShare = async () => {
    if (!treeImage) return;

    try {
      // Create image with text overlay
      const finalImage = await createImageWithText() || treeImage;

      // Convert base64 to blob
      const response = await fetch(finalImage);
      const blob = await response.blob();
      const file = new File([blob], 'my-christmas-tree.png', { type: 'image/png' });

      // Use canShare state to decide between share and download
      if (canShare && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Christmas Tree',
          text: 'Check out my decorated Christmas tree! 🎄',
          files: [file],
        });
      } else {
        // Download the image
        const link = document.createElement('a');
        link.href = finalImage;
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

        // Add user message or default text
        const displayText = messageText.trim() || 'Merry Christmas!';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.strokeText(displayText, width / 2, height - 30);
        ctx.fillText(displayText, width / 2, height - 30);

        // Convert to indexed color and add frame
        const imageData = ctx.getImageData(0, 0, width, height);
        const palette = quantize(imageData.data, 256);
        const index = applyPalette(imageData.data, palette);
        gif.writeFrame(index, width, height, { palette, delay: frameDelay });
      }

      gif.finish();
      const buffer = gif.bytes();
      const blob = new Blob([new Uint8Array(buffer)], { type: 'image/gif' });

      // Share or download based on canShare state
      const file = new File([blob], 'my-christmas-tree.gif', { type: 'image/gif' });
      if (canShare && navigator.share && navigator.canShare({ files: [file] })) {
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
      <div className="relative merry-christmas-animation bg-gradient-to-b from-red-600 to-green-700 rounded-3xl p-4 md:p-8 shadow-2xl mx-4 max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full text-white text-xl transition-all"
        >
          ✕
        </button>

        {/* Tree screenshot with text input overlay */}
        {treeImage && (
          <div className="flex justify-center mb-2">
            <div className="relative">
              <img
                src={treeImage}
                alt="Your Christmas Tree"
                className="max-h-80 md:max-h-96 rounded-lg shadow-lg border-4 border-white/30"
              />
              {/* Text input overlay */}
              <div className="absolute bottom-4 left-2 right-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Add a message..."
                  maxLength={15}
                  className="w-full px-3 py-2 text-center text-white text-sm font-bold bg-black/50 backdrop-blur-sm rounded-lg border border-white/30 placeholder-white/60 focus:outline-none focus:border-white/60"
                />
              </div>
            </div>
          </div>
        )}

        {/* Main message */}
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold rainbow-text drop-shadow-lg">
            Merry Christmas!
          </h1>
          <p className="text-sm md:text-base mt-1 text-white drop-shadow-md">
            🎄 Your tree looks amazing! 🎄
          </p>

          {/* Share/Download buttons */}
          {treeImage && (
            <div className="mt-3 flex flex-row gap-2 sm:gap-3 justify-center">
              <button
                onClick={handleShare}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/90 hover:bg-white text-green-700 text-sm sm:text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {canShare ? '📤 Share' : '💾 Download'}
              </button>
              <button
                onClick={createAnimatedGif}
                disabled={isCreatingGif}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white text-sm sm:text-base font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isCreatingGif ? '⏳...' : canShare ? '🎬 GIF Share' : '🎬 GIF'}
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
