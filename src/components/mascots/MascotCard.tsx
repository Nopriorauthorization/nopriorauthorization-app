'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useMascotController } from '@/context/MascotController';

interface MascotCardProps {
  id: string;
  name: string;
  audioSrc: string;
  imageSrc: string;
  alt: string;
}

export default function MascotCard({ id, name, audioSrc, imageSrc, alt }: MascotCardProps) {
  const { activeMascot, speak } = useMascotController();
  const isActive = activeMascot === id;

  const handleClick = () => {
    if (isActive) {
      // If already active, do nothing or stop
      return;
    }

    // Speak immediately on click
    speak(id, audioSrc);
  };

  return (
    <div
      className={`relative cursor-pointer transition-all duration-200 ${
        isActive ? 'ring-2 ring-pink-500 ring-offset-2' : 'hover:scale-105'
      }`}
      onClick={handleClick}
    >
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg">
        <Image
          src={imageSrc}
          alt={alt}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-white">{name}</p>
        {isActive && (
          <div className="mt-1 flex justify-center">
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
}