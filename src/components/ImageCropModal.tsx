'use client';

import { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface ImageCropModalProps {
  imageUrl: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropModal({ imageUrl, onCropComplete, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = useCallback((location: { x: number; y: number }) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropCompleteCallback = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    const image = new Image();
    image.src = imageUrl;
    await new Promise((resolve) => { image.onload = resolve; });

    const canvas = document.createElement('canvas');
    const size = 100;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create circular clip
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw cropped image
    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      size,
      size
    );

    const croppedImageUrl = canvas.toDataURL('image/png');
    onCropComplete(croppedImageUrl);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl p-4 mx-4 max-w-sm w-full">
        <h3 className="text-lg font-bold text-center mb-4">Crop Your Photo</h3>

        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-gray-600">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={createCroppedImage}
            className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
