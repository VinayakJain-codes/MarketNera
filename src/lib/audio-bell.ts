/**
 * High-Impact Service Bell Audio Synthesizer for Shopkeeper Order Alerts
 * 
 * Uses the Web Audio API to produce an authentic, piercing, high-volume counter-bell
 * chime ("DING-DING!") with zero external network or asset dependencies.
 * 
 * Includes browser gesture unlock, multi-harmonic metallic acoustic synthesis,
 * and a repeating notification loop until the shopkeeper accepts or silences the order.
 */

let globalAudioCtx: AudioContext | null = null;
let repeatIntervalTimer: ReturnType<typeof setInterval> | null = null;
let isAlertActive: boolean = false;
let unlockInitialized: boolean = false;

function getOrCreateAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!globalAudioCtx || globalAudioCtx.state === "closed") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      globalAudioCtx = new AudioContextClass();
    }
    return globalAudioCtx;
  } catch (err) {
    console.error("Failed to initialize AudioContext:", err);
    return null;
  }
}

/**
 * Prime and unlock the audio context on user interaction (clicks, touches)
 * to satisfy modern browser autoplay policies.
 */
export function initAudioUnlock(): void {
  if (typeof window === "undefined" || unlockInitialized) return;
  unlockInitialized = true;

  const unlock = () => {
    const ctx = getOrCreateAudioContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().then(() => {
        console.log("AudioContext resumed and unlocked successfully");
      }).catch((e) => console.warn("Could not resume AudioContext:", e));
    }
  };

  const options = { once: false, passive: true };
  window.addEventListener("click", unlock, options);
  window.addEventListener("touchstart", unlock, options);
  window.addEventListener("keydown", unlock, options);
}

/**
 * Synthesizes a single metallic bell chime strike with authentic harmonics and resonance.
 */
function synthesizeBellStroke(
  ctx: AudioContext,
  startTime: number,
  baseFrequency: number = 1320, // High E6
  volumeScale: number = 0.95
) {
  // Master gain for this individual stroke with compressor/limiter routing
  const strokeGain = ctx.createGain();
  strokeGain.gain.setValueAtTime(volumeScale, startTime);

  // 1. Clapper impact transient (sharp metallic click)
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = "triangle";
  clickOsc.frequency.setValueAtTime(3600, startTime);
  clickGain.gain.setValueAtTime(0.5 * volumeScale, startTime);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.035);
  clickOsc.connect(clickGain);
  clickGain.connect(strokeGain);
  clickOsc.start(startTime);
  clickOsc.stop(startTime + 0.035);

  // 2. Harmonic Partials of a real brass/bronze counter bell
  const partials = [
    { ratio: 0.5, amp: 0.35, decay: 1.2 },    // Sub-octave hum tone
    { ratio: 1.0, amp: 1.0,  decay: 2.4 },    // Strike fundamental note
    { ratio: 1.21, amp: 0.45, decay: 1.8 },   // Minor-third overtone
    { ratio: 1.52, amp: 0.55, decay: 1.7 },   // Quint overtone
    { ratio: 2.0,  amp: 0.65, decay: 1.5 },   // Nominal octave ring
    { ratio: 2.76, amp: 0.4,  decay: 1.1 },   // Metallic high overtone
    { ratio: 3.42, amp: 0.3,  decay: 0.8 },   // Shimmer overtone
    { ratio: 4.88, amp: 0.2,  decay: 0.5 },   // High air sparkle
  ];

  // Shimmer / vibrato LFO (giving acoustic vibration of cast metal)
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(6.0, startTime); // 6 Hz flutter
  lfoGain.gain.setValueAtTime(3.5, startTime);
  lfo.connect(lfoGain);
  lfo.start(startTime);
  lfo.stop(startTime + 2.5);

  partials.forEach((p) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const freq = baseFrequency * p.ratio;
    osc.frequency.setValueAtTime(freq, startTime);
    lfoGain.connect(osc.frequency); // apply subtle metallic wobble

    // Envelope: Instant attack, ringing natural decay
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(p.amp * 0.25 * volumeScale, startTime + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + p.decay);

    osc.connect(gain);
    gain.connect(strokeGain);

    osc.start(startTime);
    osc.stop(startTime + p.decay);
  });

  strokeGain.connect(ctx.destination);
}

/**
 * Plays a loud, crisp double service bell ring: "DING - DING!"
 */
export function playLoudBellSound(): void {
  const ctx = getOrCreateAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  // Strike 1: Lower tone (D6 ~ 1175 Hz)
  synthesizeBellStroke(ctx, now, 1175, 1.0);
  // Strike 2: Higher bright affirmative tone (F#6 ~ 1480 Hz) after 300ms
  synthesizeBellStroke(ctx, now + 0.30, 1480, 1.0);
}

/**
 * Starts repeating the loud bell sound continuously (every 3.8s)
 * until shopkeeper explicitly accepts, cancels, or silences it.
 */
export function startLoudBellRepeating(intervalMs: number = 3800): void {
  stopLoudBell();
  isAlertActive = true;

  // Immediate first ring
  playLoudBellSound();

  repeatIntervalTimer = setInterval(() => {
    if (!isAlertActive) {
      stopLoudBell();
      return;
    }
    playLoudBellSound();
  }, intervalMs);
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
}

/**
 * Returns true if an active repeating bell alert is currently sounding.
 */
export function isBellRinging(): boolean {
  return isAlertActive;
}
