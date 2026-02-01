'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

interface MascotControllerContextType {
  activeMascot: string | null;
  speak: (mascotId: string, text: string) => void;
  stop: () => void;
}

const MascotControllerContext = createContext<MascotControllerContextType | null>(null);

export function MascotControllerProvider({ children }: { children: React.ReactNode }) {
  const [activeMascot, setActiveMascot] = useState<string | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((mascotId: string, text: string) => {
    try {
      // Stop any current speech
      if (speechRef.current) {
        window.speechSynthesis.cancel();
        speechRef.current = null;
      }

      // Create new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);
      speechRef.current = utterance;

      // Configure voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Try to use a female voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('samantha') ||
        voice.name.toLowerCase().includes('susan')
      ) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Set active mascot
      setActiveMascot(mascotId);

      // Handle speech end
      utterance.onend = () => {
        setActiveMascot(null);
        speechRef.current = null;
      };

      utterance.onerror = (error) => {
        console.error(`Speech synthesis failed for ${mascotId}:`, error);
        setActiveMascot(null);
        speechRef.current = null;
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error(`Failed to initialize speech for ${mascotId}:`, error);
      setActiveMascot(null);
    }
  }, []);

  const stop = useCallback(() => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
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
    throw new Error('useMascotController must be used within a MascotControllerProvider');
  }
  return context;
}