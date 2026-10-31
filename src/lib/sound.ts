/**
 * Zero-dependency Web Audio API sound synthesizer for SKYFALL.
 * Generates subtle esports interface sounds using pure browser Web Audio synthesis.
 * Safe for SSR and respects user mute preferences.
 */

const STORAGE_KEY = "skyfall_audio_muted";

// Safe check for browser environment
function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isAudioMuted(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAudioMuted(muted: boolean): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? "true" : "false");
    window.dispatchEvent(
      new CustomEvent("skyfall:audio-toggle", { detail: { muted } })
    );
  } catch {
    // Ignore storage failures
  }
}

export function toggleAudioMute(): boolean {
  const current = isAudioMuted();
  const next = !current;
  setAudioMuted(next);
  return next;
}

// AudioContext singleton
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (!isBrowser()) return null;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return null;

    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * 1. Success Chime: Upward arpeggio (C5 -> E5 -> G5)
 * Used for: payment submitted, room updated, registration complete.
 */
export function playSuccessTone(): void {
  if (isAudioMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteDuration = 0.09;
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime + idx * noteDuration);

      gain.gain.setValueAtTime(0.001, startTime + idx * noteDuration);
      gain.gain.exponentialRampToValueAtTime(
        0.12,
        startTime + idx * noteDuration + 0.015
      );
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        startTime + idx * noteDuration + noteDuration + 0.08
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * noteDuration);
      osc.stop(startTime + idx * noteDuration + noteDuration + 0.1);
    });
  } catch {
    // Ignore audio failures
  }
}

/**
 * 2. Room Open / Tactical Comms Beep (440Hz -> 880Hz crisp alert)
 * Used for: Room ID / password copy, room unlocked.
 */
export function playRoomOpenTone(): void {
  if (isAudioMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;

    // First tactical pip
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(587.33, startTime); // D5

    gain1.gain.setValueAtTime(0.001, startTime);
    gain1.gain.exponentialRampToValueAtTime(0.14, startTime + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(startTime);
    osc1.stop(startTime + 0.07);

    // Second higher pip
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, startTime + 0.08); // A5

    gain2.gain.setValueAtTime(0.001, startTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.12, startTime + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(startTime + 0.08);
    osc2.stop(startTime + 0.2);
  } catch {
    // Ignore audio failures
  }
}

/**
 * 3. Trophy Fanfare (Harmonic 4-note victory chord)
 * Used for: Tournament Winner, Grand Finals completion, Prize payout.
 */
export function playTrophyTone(): void {
  if (isAudioMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [
      { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
      { freq: 659.25, time: 0.1, dur: 0.12 }, // E5
      { freq: 783.99, time: 0.2, dur: 0.14 }, // G5
      { freq: 1046.5, time: 0.32, dur: 0.35 }, // C6 (sustained triumph)
    ];

    const startTime = ctx.currentTime;

    chords.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime + time);

      gain.gain.setValueAtTime(0.001, startTime + time);
      gain.gain.exponentialRampToValueAtTime(0.15, startTime + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + time);
      osc.stop(startTime + time + dur + 0.05);
    });
  } catch {
    // Ignore audio failures
  }
}

/**
 * 4. Subtle UI Click
 * Ultra-short 15ms high-frequency soft click
 */
export function playClickTone(): void {
  if (isAudioMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200, startTime);
    osc.frequency.exponentialRampToValueAtTime(300, startTime + 0.015);

    gain.gain.setValueAtTime(0.06, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.02);
  } catch {
    // Ignore audio failures
  }
}

/**
 * 5. Error Tone
 * Descending dual buzz for form error or rejection
 */
export function playErrorTone(): void {
  if (isAudioMuted()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(240, startTime);
    osc.frequency.linearRampToValueAtTime(160, startTime + 0.15);

    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.16);
  } catch {
    // Ignore audio failures
  }
}
