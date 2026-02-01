// src/lib/mediaController.ts
import { MASCOT_MEDIA, MascotId } from './mascotMedia';

type MediaEl = HTMLVideoElement | HTMLAudioElement;

class MediaController {
  private current: MediaEl | null = null;

  play(el: MediaEl) {
    // Stop/reset previous
    if (this.current && this.current !== el) {
      try {
        this.current.pause();
        this.current.currentTime = 0;
      } catch {}
    }
    this.current = el;

    // Always user-initiated only; no autoplay outside handlers
    el.muted = el.muted ?? true;

    // Play
    const p = el.play();
    if (p && typeof (p as Promise<void>).catch === "function") {
      (p as Promise<void>).catch(() => {
        // Swallow play errors from browser policies; UI should reflect "not playing"
      });
    }
  }

  // New method to play mascot videos by ID
  playMascot(mascotId: MascotId, videoElement: HTMLVideoElement) {
    const mascot = MASCOT_MEDIA[mascotId];
    if (!mascot) {
      console.error(`Mascot ${mascotId} not found in registry`);
      return;
    }

    // Ensure the video element has the correct source
    if (videoElement.src !== mascot.videoSrc) {
      videoElement.src = mascot.videoSrc;
    }

    this.play(videoElement);
  }

  stopAll() {
    if (!this.current) return;
    try {
      this.current.pause();
      this.current.currentTime = 0;
    } catch {}
    this.current = null;
  }

  setMuted(muted: boolean) {
    if (!this.current) return;
    try {
      this.current.muted = muted;
    } catch {}
  }

  getCurrent() {
    return this.current;
  }
}

export const mediaController = new MediaController();
