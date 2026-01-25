'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { playMascotVideo, stopActiveMascotVideo, isMascotActive } from '@/lib/mascotVideoController';

interface MascotCardProps {
  id: string;
  name: string;
  text: string;
  imageSrc: string;
  alt: string;
  videoSrc: string;
}

export default function MascotCard({ id, name, text, imageSrc, alt, videoSrc }: MascotCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isActive = isMascotActive(id);

  const handlePlay = () => {
    if (isActive) {
      // Stop the video
      stopActiveMascotVideo();
      setIsPlaying(false);
    } else {
      // Play the video
      playMascotVideo(id, videoRef);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    stopActiveMascotVideo();
    setIsPlaying(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-pink-500/50 transition group">
      {/* Video Element - Hidden until played */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-48 object-cover rounded-xl mb-4"
        style={{ display: isPlaying ? 'block' : 'none' }}
        onEnded={() => setIsPlaying(false)}
        playsInline
        preload="metadata"
      />

      {/* Image Thumbnail - Shown when not playing */}
      {!isPlaying && (
        <div className="w-full h-48 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition">
          <Image
            src={imageSrc}
            alt={alt}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        </div>
      )}

      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-gray-400 mb-4">{text}</p>

      {/* Controls */}
      <div className="flex gap-2 justify-center">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            ▶ Listen / Watch
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="border-2 border-white/40 text-white hover:bg-white/10 px-4 py-2 rounded-full font-semibold transition flex items-center gap-2"
          >
            ⏹ Stop
          </button>
        )}
      </div>
    </div>
  );
}