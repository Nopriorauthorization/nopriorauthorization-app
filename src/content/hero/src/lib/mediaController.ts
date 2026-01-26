// src/lib/mediaController.ts
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
