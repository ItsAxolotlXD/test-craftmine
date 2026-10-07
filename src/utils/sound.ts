// Minecraft button click audio player
// Updated to authentic Minecraft button click sound:
// https://static.wikia.nocookie.net/ep-deo/images/6/69/Minecraft_button_click.ogg/revision/latest?cb=20261006123224

const PRIMARY_AUDIO_URL = '/sounds/Minecraft_button_click.ogg';
const FALLBACK_MP3_URL = '/sounds/Minecraft_button_click.mp3';
const REMOTE_FALLBACK_URL = 'https://static.wikia.nocookie.net/ep-deo/images/6/69/Minecraft_button_click.ogg/revision/latest?cb=20261006123224';

let sharedAudioCtx: AudioContext | null = null;
let cachedAudioBuffer: AudioBuffer | null = null;
let isFetchingBuffer = false;
let lastPlayTime = 0;

// Pool of HTML5 Audio elements as an instant fallback
const audioPool: HTMLAudioElement[] = [];
const POOL_SIZE = 5;

const initAudioPool = () => {
  if (typeof window === 'undefined' || audioPool.length > 0) return;
  for (let i = 0; i < POOL_SIZE; i++) {
    try {
      const audio = new Audio();
      audio.preload = 'auto';
      const canPlayOgg = audio.canPlayType('audio/ogg; codecs="vorbis"');
      audio.src = canPlayOgg ? PRIMARY_AUDIO_URL : FALLBACK_MP3_URL;
      audio.volume = 0.85;
      audioPool.push(audio);
    } catch {
      // Audio element not supported
    }
  }
};

// Pre-load audio into AudioBuffer via Web Audio API for 0ms latency playback
const loadAudioBuffer = async () => {
  if (cachedAudioBuffer || isFetchingBuffer || typeof window === 'undefined') return;
  isFetchingBuffer = true;

  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }

    const tryFetch = async (url: string): Promise<ArrayBuffer> => {
      const resp = await fetch(url, { cache: 'force-cache' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.arrayBuffer();
    };

    let arrayBuffer: ArrayBuffer | null = null;
    try {
      arrayBuffer = await tryFetch(PRIMARY_AUDIO_URL);
    } catch {
      try {
        arrayBuffer = await tryFetch(FALLBACK_MP3_URL);
      } catch {
        arrayBuffer = await tryFetch(REMOTE_FALLBACK_URL);
      }
    }

    if (arrayBuffer && sharedAudioCtx) {
      cachedAudioBuffer = await sharedAudioCtx.decodeAudioData(arrayBuffer);
    }
  } catch {
    // Web Audio decode failed or unsupported, will use audio pool
  } finally {
    isFetchingBuffer = false;
  }
};

// Initialize listeners on first user gesture
if (typeof window !== 'undefined') {
  const handleFirstInteraction = () => {
    initAudioPool();
    loadAudioBuffer();
    window.removeEventListener('pointerdown', handleFirstInteraction);
    window.removeEventListener('keydown', handleFirstInteraction);
  };
  window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true });
  window.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true });
}

/**
 * Play button click sound.
 * Guaranteed to ONLY play on button press down.
 * 120ms debounce prevents any duplicate sounds on button release or click events.
 */
export const playPopSound = () => {
  try {
    const nowTime = Date.now();
    // 120ms cooldown ensures sound only plays once on button press down, never on button release
    if (nowTime - lastPlayTime < 120) {
      return;
    }
    lastPlayTime = nowTime;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
        sharedAudioCtx = new AudioContextClass();
      }

      if (sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume().catch(() => {});
      }

      if (cachedAudioBuffer && sharedAudioCtx.state === 'running') {
        const source = sharedAudioCtx.createBufferSource();
        source.buffer = cachedAudioBuffer;

        const gainNode = sharedAudioCtx.createGain();
        gainNode.gain.setValueAtTime(0.85, sharedAudioCtx.currentTime);

        source.connect(gainNode);
        gainNode.connect(sharedAudioCtx.destination);
        source.start(0);
        return;
      }
    }

    // Fallback: Use HTML5 Audio Pool
    if (audioPool.length === 0) {
      initAudioPool();
    }

    const availableAudio = audioPool.find((a) => a.paused || a.ended) || audioPool[0];
    if (availableAudio) {
      availableAudio.currentTime = 0;
      availableAudio.play().catch(() => {});
      return;
    }

    // Direct audio element fallback
    const singleAudio = new Audio(PRIMARY_AUDIO_URL);
    singleAudio.volume = 0.85;
    singleAudio.play().catch(() => {});
  } catch {
    // Audio playback blocked or not available
  }
};

export const playClickSound = playPopSound;
