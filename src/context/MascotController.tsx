'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface MascotControllerContextType {
  activeMascot: string | null;
  speak: (mascotId: string, audioSrc: string) => void;
  stop: () => void;
}

const MascotControllerContext = createContext<MascotControllerContextType | null>(null);

export function MascotControllerProvider({ children }: { children: React.ReactNode }) {
  const [activeMascot, setActiveMascot] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback((mascotId: string, audioSrc: string) => {
    try {
      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }

      // Create new audio element
      const audioEl = new Audio(audioSrc);
      audioRef.current = audioEl;

      // Set properties synchronously
      audioEl.muted = false;
      audioEl.volume = 1;

      // Set active mascot
      setActiveMascot(mascotId);

      // Play immediately
      const playPromise = audioEl.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio started successfully
            console.log(`Mascot ${mascotId} audio started`);
          })
          .catch((error) => {
            console.error(`Mascot ${mascotId} audio failed:`, error);
            setActiveMascot(null);
            audioRef.current = null;
          });
      }

      // Handle end
      audioEl.addEventListener('ended', () => {
        setActiveMascot(null);
        audioRef.current = null;
      });

      // Handle errors
      audioEl.addEventListener('error', (e) => {
        console.error(`Mascot ${mascotId} audio error:`, e);
        setActiveMascot(null);
        audioRef.current = null;
      });

    } catch (error) {
      console.error(`Failed to initialize mascot ${mascotId} audio:`, error);
      setActiveMascot(null);
      audioRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setActiveMascot(null);
  }, []);

  return (
    <MascotControllerContext.Provider value={{ activeMascot, speak, stop }}>
      {children}
    </MascotControllerContext.Provider>
  );
}

export function useMascotController() {
  const context = useContext(MascotControllerContext);
  if (!context) {
    throw new Error('useMascotController must be used within MascotControllerProvider');
  }
  return context;
}