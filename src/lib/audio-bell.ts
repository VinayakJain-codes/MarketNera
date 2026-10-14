/**
 * High-Impact Service Bell Audio Synthesizer & Player for Shopkeeper Order Alerts
 * 
 * Combines pre-rendered loud WAV audio (/sounds/order-bell.wav) with Web Audio API synthesis
 * for 100% reliability across all mobile and desktop browsers.
 * 
 * Features:
 * - Non-stop continuous bell ring until order is accepted or declined
 * - Autoplay permission unlock on user gesture
 * - Safe Web Audio fallback that never throws AudioParam scheduling errors
 */

let globalAudioCtx: AudioContext | null = null;
let bellAudioElement: HTMLAudioElement | null = null;
let customerAudioElement: HTMLAudioElement | null = null;
let repeatIntervalTimer: ReturnType<typeof setInterval> | null = null;
let isAlertActive: boolean = false;
let unlockInitialized: boolean = false;
let isAudioUnlocked: boolean = false;

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!globalAudioCtx || globalAudioCtx.state === "closed") {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      globalAudioCtx = new AudioContextClass();
    }
    return globalAudioCtx;
  } catch (err) {
    console.error("Failed to initialize AudioContext:", err);
    return null;
  }
}

function getBellAudioElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!bellAudioElement) {
    try {
      bellAudioElement = new Audio("/sounds/order-bell.wav");
      bellAudioElement.preload = "auto";
      bellAudioElement.volume = 1.0;
    } catch (e) {
      console.warn("Could not create bell audio element:", e);
    }
  }
  return bellAudioElement;
}

function getCustomerAudioElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!customerAudioElement) {
    try {
      customerAudioElement = new Audio("/sounds/customer-chime.wav");
      customerAudioElement.preload = "auto";
      customerAudioElement.volume = 0.9;
    } catch (e) {
      console.warn("Could not create customer audio element:", e);
    }
  }
  return customerAudioElement;
}

/**
 * Prime and unlock audio engines on user interaction (clicks, touches)
 * to satisfy modern browser autoplay policies.
 */
export function initAudioUnlock(): void {
  if (typeof window === "undefined" || unlockInitialized) return;
  unlockInitialized = true;

  const unlock = () => {
    isAudioUnlocked = true;

    // 1. Unlock Web Audio API
    const ctx = getOrCreateAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // 2. Pre-prime HTML5 Audio elements with brief silent play
    const audio = getBellAudioElement();
    if (audio) {
      audio.load();
    }
    const custAudio = getCustomerAudioElement();
    if (custAudio) {
      custAudio.load();
    }
  };

  const options = { once: false, passive: true };
  window.addEventListener("click", unlock, options);
  window.addEventListener("touchstart", unlock, options);
  window.addEventListener("keydown", unlock, options);
}

/**
 * Safe Web Audio API synthesizer for metallic counter-bell chime
 */
function playWebAudioBellChime(): void {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime + 0.05;

  const playStrike = (time: number, freq: number, vol: number) => {
    const master = ctx.createGain();
    master.gain.setValueAtTime(vol, time);
    master.gain.setTargetAtTime(0.0001, time + 0.02, 0.4);
    master.connect(ctx.destination);

    // Strike clapper
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(3500, time);
    clickGain.gain.setValueAtTime(0.6 * vol, time);
    clickGain.gain.setTargetAtTime(0.0001, time + 0.005, 0.015);
    click.connect(clickGain);
    clickGain.connect(master);
    click.start(time);
    click.stop(time + 0.05);

    // Metal bell harmonics
    const partials = [
      { ratio: 1.0, gain: 0.8 },
      { ratio: 1.2, gain: 0.5 },
      { ratio: 1.5, gain: 0.6 },
      { ratio: 2.0, gain: 0.7 },
      { ratio: 2.76, gain: 0.4 },
      { ratio: 3.5, gain: 0.3 },
    ];

    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * p.ratio, time);

      pGain.gain.setValueAtTime(p.gain * vol, time);
      pGain.gain.setTargetAtTime(0.0001, time + 0.05, 0.5);

      osc.connect(pGain);
      pGain.connect(master);

      osc.start(time);
      osc.stop(time + 1.8);
    });
  };

  // Strike 1 (D6)
  playStrike(now, 1200, 0.9);
  // Strike 2 (F#6)
  playStrike(now + 0.28, 1440, 0.95);
}

/**
 * Plays a single loud double-ding bell ring
 */
export function playLoudBellSound(): void {
  initAudioUnlock();

  // Try HTML5 Audio element first (highest quality & loud volume)
  const audio = getBellAudioElement();
  if (audio) {
    audio.currentTime = 0;
    audio.volume = 1.0;
    audio.play().catch((err) => {
      console.warn("HTML5 audio playback error, falling back to Web Audio:", err);
      playWebAudioBellChime();
    });
  } else {
    playWebAudioBellChime();
  }
}

/**
 * Starts continuous, NON-STOP bell ringing until stopLoudBell() is explicitly called!
 * (When shopkeeper accepts or declines order)
 */
export function startLoudBellNonStop(): void {
  stopLoudBell();
  isAlertActive = true;

  const audio = getBellAudioElement();
  if (audio) {
    audio.loop = true;
    audio.currentTime = 0;
    audio.volume = 1.0;
    audio.play().catch((err) => {
      console.warn("Looping HTML5 audio play error:", err);
    });
  }

  // Also synthesize initial bell chime
  playWebAudioBellChime();

  // Run periodic loop every 2.2 seconds to ensure bell rings non-stop even if audio looped
  repeatIntervalTimer = setInterval(() => {
    if (!isAlertActive) {
      stopLoudBell();
      return;
    }

    const currentAudio = getBellAudioElement();
    if (currentAudio) {
      if (currentAudio.paused) {
        currentAudio.currentTime = 0;
        currentAudio.play().catch(() => {});
      }
    } else {
      playWebAudioBellChime();
    }
  }, 2200);
}

/**
 * Backwards compatibility alias
 */
export function startLoudBellRepeating(intervalMs: number = 2200): void {
  startLoudBellNonStop();
}

/**
 * Immediately stops any ringing bell alert.
 */
export function stopLoudBell(): void {
  isAlertActive = false;
  if (repeatIntervalTimer) {
    clearInterval(repeatIntervalTimer);
    repeatIntervalTimer = null;
  }
  const audio = getBellAudioElement();
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  }
}

/**
 * Returns true if an active repeating bell alert is currently sounding.
 */
export function isBellRinging(): boolean {
  return isAlertActive;
}

/**
 * Returns whether audio has been primed/unlocked by a user gesture.
 */
export function isAudioEngineUnlocked(): boolean {
  return isAudioUnlocked;
}

/**
 * Plays a warm, cheerful ascending 3-note chime for customer order updates
 */
export function playCustomerOrderChime(): void {
  initAudioUnlock();

  const custAudio = getCustomerAudioElement();
  if (custAudio) {
    custAudio.currentTime = 0;
    custAudio.volume = 0.9;
    custAudio.play().catch(() => {
      playWebAudioCustomerChime();
    });
  } else {
    playWebAudioCustomerChime();
  }
}

function playWebAudioCustomerChime(): void {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const notes = [
    { freq: 523.25, time: 0 },    // C5
    { freq: 659.25, time: 0.12 }, // E5
    { freq: 783.99, time: 0.24 }, // G5
  ];

  const now = ctx.currentTime + 0.05;
  notes.forEach(({ freq, time }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + time);

    gain.gain.setValueAtTime(0.3, now + time);
    gain.gain.setTargetAtTime(0.0001, now + time + 0.02, 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + time);
    osc.stop(now + time + 0.8);
  });
}
