// src/lib/mediaController.ts
// ❗ GLOBAL MEDIA CONTROLLER - SINGLE SOURCE OF TRUTH
// There may only be one active media session at any time across the entire app.
// No exceptions.

class MediaController {
  private current: HTMLVideoElement | null = null;
  private currentMascotId: string | null = null;

  play(video: HTMLVideoElement, mascotId: string) {
    // Stop any currently playing video
    if (this.current && this.current !== video) {
      this.current.pause();
      this.current.currentTime = 0;
    }

    // Set new current video
    this.current = video;
    this.currentMascotId = mascotId;

    // Play the video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error(`Failed to play video for mascot ${mascotId}:`, error);
        this.reset();
      });
    }
  }

  stopAll() {
    if (this.current) {
      this.current.pause();
      this.current.currentTime = 0;
      this.reset();
    }
  }

  muteAll(muted: boolean) {
    if (this.current) {
      this.current.muted = muted;
    }
  }

  getCurrentMascotId(): string | null {
    return this.currentMascotId;
  }

  isPlaying(mascotId: string): boolean {
    return this.currentMascotId === mascotId;
  }

  private reset() {
    this.current = null;
    this.currentMascotId = null;
  }
}

// ❗ DO NOT:
// - Autoplay videos
// - Let mascots manage their own audio
// - Add useEffect play hooks
// - Duplicate video state

export const mediaController = new MediaController();