export interface SoundboardClip {
  id: string;
  name: string;
  emoji: string;
  fileName: string;
  src: string;
  category: string;
  description: string;
  tags?: string[];
}

export const SOUNDBOARD_STORAGE_KEY = 'topcast:soundboard-volume';
export const DEFAULT_SOUNDBOARD_VOLUME = 0.8;

export const SOUNDBOARD_CLIPS: SoundboardClip[] = [
  {
    id: 'bark-fart',
    name: 'bark fart',
    emoji: '🐶',
    fileName: 'bark-fart-made-with-Voicemod.mp3',
    src: './sounds/bark-fart-made-with-Voicemod.mp3',
    category: 'Voicemod',
    description: 'Efeito cômico de latido canino seguido de peido clássico.',
    tags: ['fart', 'bark', 'voicemod', 'humor', 'meme'],
  },
  {
    id: 'dry-fart',
    name: 'dry fart',
    emoji: '💨',
    fileName: 'dry-fart-made-with-Voicemod.mp3',
    src: './sounds/dry-fart-made-with-Voicemod.mp3',
    category: 'Voicemod',
    description: 'Efeito sonoro de peido seco e rápido com impacto acústico.',
    tags: ['fart', 'dry', 'voicemod', 'humor', 'meme'],
  },
];

export function getSoundboardVolume(): number {
  if (typeof window === 'undefined') return DEFAULT_SOUNDBOARD_VOLUME;
  try {
    const raw = window.localStorage.getItem(SOUNDBOARD_STORAGE_KEY);
    if (raw !== null) {
      const val = parseFloat(raw);
      if (!Number.isNaN(val) && val >= 0 && val <= 1) {
        return val;
      }
    }
  } catch {
    // fallback se localStorage indisponível
  }
  return DEFAULT_SOUNDBOARD_VOLUME;
}

export function saveSoundboardVolume(volume: number): void {
  if (typeof window === 'undefined') return;
  try {
    const clamped = Math.max(0, Math.min(1, volume));
    window.localStorage.setItem(SOUNDBOARD_STORAGE_KEY, clamped.toString());
    window.dispatchEvent(new CustomEvent('topcast:soundboard-volume-changed', { detail: clamped }));
  } catch {
    // ignorar erro
  }
}

// Gerenciador de reprodução de áudio do soundboard
class SoundboardManager {
  private activeAudios = new Map<string, HTMLAudioElement>();
  private activeListeners = new Set<(activeIds: string[]) => void>();

  public subscribe(listener: (activeIds: string[]) => void): () => void {
    this.activeListeners.add(listener);
    listener(this.getActiveClipIds());
    return () => {
      this.activeListeners.delete(listener);
    };
  }

  private notify(): void {
    const active = this.getActiveClipIds();
    for (const listener of this.activeListeners) {
      listener(active);
    }
  }

  public getActiveClipIds(): string[] {
    return Array.from(this.activeAudios.keys());
  }

  public isPlaying(clipId: string): boolean {
    return this.activeAudios.has(clipId);
  }

  public play(clip: SoundboardClip, volume = getSoundboardVolume()): void {
    if (typeof window === 'undefined' || typeof window.Audio === 'undefined') {
      return;
    }

    // Se já estiver tocando esse som, para e reinicia
    this.stop(clip.id);

    try {
      const audio = new window.Audio(clip.src);
      audio.volume = Math.max(0, Math.min(1, volume));

      const onEnd = () => {
        this.activeAudios.delete(clip.id);
        this.notify();
      };

      audio.addEventListener('ended', onEnd);
      audio.addEventListener('error', onEnd);

      this.activeAudios.set(clip.id, audio);
      this.notify();

      void audio.play().catch((err: unknown) => {
        console.warn(`[Soundboard] Falha ao reproduzir ${clip.name}:`, err);
        this.activeAudios.delete(clip.id);
        this.notify();
      });
    } catch (err) {
      console.warn(`[Soundboard] Erro ao instanciar áudio para ${clip.name}:`, err);
    }
  }

  public stop(clipId: string): void {
    const audio = this.activeAudios.get(clipId);
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignorar
      }
      this.activeAudios.delete(clipId);
      this.notify();
    }
  }

  public stopAll(): void {
    for (const [, audio] of this.activeAudios) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // ignorar
      }
    }
    this.activeAudios.clear();
    this.notify();
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    for (const [, audio] of this.activeAudios) {
      try {
        audio.volume = clamped;
      } catch {
        // ignorar
      }
    }
  }
}

export const soundboardManager = new SoundboardManager();

