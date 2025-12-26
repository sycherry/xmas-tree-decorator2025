'use client';

import { useEffect, useState } from 'react';

interface UFOAbductionComboProps {
  photoUrl?: string;
}

export default function UFOAbductionCombo({ photoUrl }: UFOAbductionComboProps) {
  const [beamHeight, setBeamHeight] = useState(0);
  const [photoY, setPhotoY] = useState(80);

  useEffect(() => {
    // Animate beam growing down
    const beamInterval = setInterval(() => {
      setBeamHeight((prev) => {
        if (prev >= 100) {
          clearInterval(beamInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    // Start lifting photo after beam reaches
    const photoTimeout = setTimeout(() => {
      const photoInterval = setInterval(() => {
        setPhotoY((prev) => {
          if (prev <= 15) {
            clearInterval(photoInterval);
            return 15;
          }
          return prev - 2;
        });
      }, 50);
    }, 1000);

    return () => {
      clearInterval(beamInterval);
      clearTimeout(photoTimeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* UFO */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-6xl md:text-8xl animate-bounce"
        style={{ top: '5%', animationDuration: '2s' }}
      >
        🛸
      </div>

      {/* Beam */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: '12%',
          width: '150px',
          height: `${beamHeight}%`,
          background: 'linear-gradient(180deg, rgba(0, 255, 150, 0.8) 0%, rgba(0, 255, 150, 0.2) 100%)',
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
          transition: 'height 0.1s ease-out',
        }}
      />

      {/* Photo being abducted */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-all duration-100"
        style={{ top: `${photoY}%` }}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Abducted"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-4 border-green-400 shadow-lg"
            style={{
              boxShadow: '0 0 30px rgba(0, 255, 150, 0.8)',
              animation: 'spin 2s linear infinite',
            }}
          />
        ) : (
          <div
            className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center text-4xl"
            style={{
              boxShadow: '0 0 30px rgba(0, 255, 150, 0.8)',
              animation: 'spin 2s linear infinite',
            }}
          >
            📷
          </div>
        )}
      </div>

      {/* Aliens on sides */}
      <div className="absolute left-4 top-1/4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>
        👽
      </div>
      <div className="absolute right-4 top-1/3 text-4xl animate-bounce" style={{ animationDelay: '0.8s' }}>
        👽
      </div>

      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-white animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${8 + Math.random() * 8}px`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}
