// Global Mascot Video Controller
// Enforces "One Mascot at a Time" rule for MP4 video playback

class MascotVideoController {
  private activeVideoRef: HTMLVideoElement | null = null;
  private activeMascotId: string | null = null;

  /**
   * Play a mascot video, stopping any currently playing video
   * @param mascotId - The ID of the mascot to play
   * @param videoRef - Reference to the video element
   */
  playMascotVideo(mascotId: string, videoRef: HTMLVideoElement): void {
    try {
      // Stop any currently playing video
      this.stopActiveMascotVideo();

      // Set new active video
      this.activeVideoRef = videoRef;
      this.activeMascotId = mascotId;

      // Play the new video
      videoRef.currentTime = 0; // Reset to beginning
      videoRef.play().catch((error) => {
        console.error(`Failed to play video for ${mascotId}:`, error);
        this.reset();
      });

    } catch (error) {
      console.error(`Error playing mascot video for ${mascotId}:`, error);
      this.reset();
    }
  }

  /**
   * Stop the currently active mascot video
   */
  stopActiveMascotVideo(): void {
    if (this.activeVideoRef) {
      try {
        this.activeVideoRef.pause();
        this.activeVideoRef.currentTime = 0;
      } catch (error) {
        console.error('Error stopping active video:', error);
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
   * Check if a specific mascot is currently playing
   */
  isMascotPlaying(mascotId: string): boolean {
    return this.activeMascotId === mascotId;
  }

  /**
   * Handle video end event - reset state
   */
  onVideoEnded(): void {
    this.reset();
  }

  /**
   * Reset the controller state
   */
  private reset(): void {
    this.activeVideoRef = null;
    this.activeMascotId = null;
  }
}

// Export singleton instance
export const mascotVideoController = new MascotVideoController();