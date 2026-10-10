// YouTube background audio controller for "Dear Biyenan" (5e_KM3SuBjE)
// Supports programmatic play, pause, mute, volume, and state subscriptions

type StateListener = (state: { isPlaying: boolean; isMuted: boolean; isReady: boolean }) => void;

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId || !urlOrId.trim()) return "5e_KM3SuBjE";
  const clean = urlOrId.trim();
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (match && match[1]) {
    return match[1];
  }
  if (/^[\w-]{11}$/.test(clean)) {
    return clean;
  }
  return clean;
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => number;
  loadVideoById: (id: string | { videoId: string }) => void;
  cueVideoById: (id: string | { videoId: string }) => void;
}

class YouTubeAudioController {
  private player: YTPlayer | null = null;
  private isReady: boolean = false;
  private pendingPlay: boolean = false;
  private isPlayingState: boolean = false;
  private isMutedState: boolean = false;
  private volume: number = 85;
  private listeners: Set<StateListener> = new Set();
  private videoId: string = "5e_KM3SuBjE";

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aian_dang_wedding_couple_info");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.bgMusicYoutubeUrl) {
            this.videoId = extractYouTubeId(parsed.bgMusicYoutubeUrl);
          }
        }
      } catch {
        // ignore
      }

      window.addEventListener("wedding_couple_updated", () => {
        try {
          const saved = localStorage.getItem("aian_dang_wedding_couple_info");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.bgMusicYoutubeUrl) {
              this.setVideo(parsed.bgMusicYoutubeUrl);
            }
          }
        } catch {
          // ignore
        }
      });

      this.init();
    }
  }

  public getVideoId(): string {
    return this.videoId;
  }

  public setVideo(urlOrId: string, autoplayIfPlaying: boolean = false) {
    const newId = extractYouTubeId(urlOrId);
    if (!newId || newId === this.videoId) return;
    this.videoId = newId;

    if (this.player && this.isReady) {
      try {
        if (this.isPlayingState || autoplayIfPlaying) {
          this.player.loadVideoById(newId);
          this.isPlayingState = true;
        } else {
          this.player.cueVideoById(newId);
        }
        this.notify();
      } catch (err) {
        console.warn("Error changing YouTube audio track:", err);
      }
    }
  }

  public init() {
    if (typeof window === "undefined" || this.isReady || this.player) return;

    // Ensure hidden container exists in DOM
    let container = document.getElementById("yt-audio-player");
    if (!container) {
      container = document.createElement("div");
      container.id = "yt-audio-player";
      container.style.position = "fixed";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      container.style.width = "1px";
      container.style.height = "1px";
      container.style.opacity = "0";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);
    }

    const loadPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      this.player = new window.YT.Player("yt-audio-player", {
        videoId: this.videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          loop: 1,
          playlist: this.videoId,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            this.isReady = true;
            e.target.setVolume(this.volume);
            if (this.pendingPlay) {
              this.pendingPlay = false;
              try {
                e.target.playVideo();
                this.isPlayingState = true;
              } catch {
                // ignore
              }
            }
            this.notify();
          },
          onStateChange: (e) => {
            if (window.YT) {
              const playing = e.data === window.YT.PlayerState.PLAYING;
              this.isPlayingState = playing;
              if (this.player) {
                try {
                  this.isMutedState = this.player.isMuted();
                } catch {
                  // ignore
                }
              }
              this.notify();
            }
          },
          onError: () => {
            // ignore
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        loadPlayer();
      };

      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
      }
    }
  }

  private notify() {
    const state = {
      isPlaying: this.isPlayingState,
      isMuted: this.isMutedState,
      isReady: this.isReady,
    };
    this.listeners.forEach((listener) => listener(state));
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isPlayingState,
      isMuted: this.isMutedState,
      isReady: this.isReady,
    });
    return () => this.listeners.delete(listener);
  }

  public play() {
    this.init();
    if (this.player && this.isReady) {
      try {
        if (this.isMutedState) {
          this.player.unMute();
          this.isMutedState = false;
        }
        this.player.playVideo();
        this.isPlayingState = true;
        this.notify();
      } catch {
        this.pendingPlay = true;
      }
    } else {
      this.pendingPlay = true;
    }
  }

  public pause() {
    if (this.player && this.isReady) {
      try {
        this.player.pauseVideo();
        this.isPlayingState = false;
        this.notify();
      } catch {
        // ignore
      }
    }
  }

  public toggle(): boolean {
    if (this.isPlayingState) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public mute() {
    if (this.player && this.isReady) {
      try {
        this.player.mute();
        this.isMutedState = true;
        this.notify();
      } catch {
        // ignore
      }
    }
  }

  public unMute() {
    if (this.player && this.isReady) {
      try {
        this.player.unMute();
        this.isMutedState = false;
        this.notify();
      } catch {
        // ignore
      }
    }
  }

  public toggleMute(): boolean {
    if (this.isMutedState) {
      this.unMute();
      return false;
    } else {
      this.mute();
      return true;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.player && this.isReady) {
      try {
        this.player.setVolume(this.volume);
      } catch {
        // ignore
      }
    }
  }

  public getStatus(): boolean {
    return this.isPlayingState;
  }

  public getIsMuted(): boolean {
    return this.isMutedState;
  }
}

export const weddingMusic = new YouTubeAudioController();
