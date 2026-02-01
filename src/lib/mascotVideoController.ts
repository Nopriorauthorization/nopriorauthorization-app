// Global Mascot Video Controller
// Enforces "One Mascot at a Time" rule for MP4 video playback

class MascotVideoController {
  private activeVideo: HTMLVideoElement | null = null;
  private activeMascotId: string | null = null;

  /**
   * Play a mascot video, stopping any currently playing video
   */
  playMascotVideo(mascotId: string, videoRef: React.RefObject<HTMLVideoElement>): void {
    try {
      // Stop any currently playing video
      this.stopActiveMascotVideo();

      // Set new active video
      if (videoRef.current) {
        this.activeVideo = videoRef.current;
        this.activeMascotId = mascotId;

        // Ensure video is muted if global mute is enabled
        // Note: Global mute logic would be implemented here if needed

        // Play the video
        const playPromise = this.activeVideo.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`Mascot video started: ${mascotId}`);
            })
            .catch((error) => {
              console.error(`Failed to play mascot video ${mascotId}:`, error);
              this.reset();
            });
        }
      }
    } catch (error) {
      console.error(`Error playing mascot video ${mascotId}:`, error);
      this.reset();
    }
  }

  /**
   * Stop the currently active mascot video
   */
  stopActiveMascotVideo(): void {
    if (this.activeVideo) {
      try {
        this.activeVideo.pause();
        this.activeVideo.currentTime = 0;
        console.log(`Mascot video stopped: ${this.activeMascotId}`);
      } catch (error) {
        console.error('Error stopping mascot video:', error);
      }
    }
    this.reset();
  }

  /**
   * Get the ID of the currently active mascot
   */
  getActiveMascotId(): string | null {
    return this.activeMascotId;
  }

  /**
   * Check if a specific mascot is currently active
   */
  isMascotActive(mascotId: string): boolean {
    return this.activeMascotId === mascotId;
  }

  /**
   * Reset the controller state
   */
  private reset(): void {
    this.activeVideo = null;
    this.activeMascotId = null;
  }
}

// Export singleton instance
export const mascotVideoController = new MascotVideoController();

// Export convenience functions
export const playMascotVideo = (mascotId: string, videoRef: React.RefObject<HTMLVideoElement>) => {
  mascotVideoController.playMascotVideo(mascotId, videoRef);
};

export const stopActiveMascotVideo = () => {
  mascotVideoController.stopActiveMascotVideo();
};

export const getActiveMascotId = () => {
  mascotVideoController.getActiveMascotId();
};

export const isMascotActive = (mascotId: string) => {
  mascotVideoController.isMascotActive(mascotId);
};