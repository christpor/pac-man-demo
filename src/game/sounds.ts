// Web Audio API sounds — no files needed
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function beep(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.12) {
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    gain.gain.setValueAtTime(vol, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + dur)
  } catch {}
}

// --- Siren (background music) ---
let sirenOsc: OscillatorNode | null = null
let sirenGain: GainNode | null = null
let sirenInterval: ReturnType<typeof setInterval> | null = null
let sirenTick = 0

function stopSirenLoop() {
  if (sirenInterval) { clearInterval(sirenInterval); sirenInterval = null }
  if (sirenOsc) { try { sirenOsc.stop() } catch {} sirenOsc = null }
  if (sirenGain) { sirenGain.disconnect(); sirenGain = null }
}

// Classic Pac-Man bassline: B, C, B, F#, G#, A#, B (looping)
const BASSLINE = [247, 262, 247, 185, 208, 233, 247, 247, 262, 247, 185, 208, 233, 247]

function startSirenLoop(frightened = false) {
  stopSirenLoop()
  try {
    const ac = getCtx()
    sirenGain = ac.createGain()
    sirenGain.gain.setValueAtTime(0.06, ac.currentTime)
    sirenGain.connect(ac.destination)

    sirenOsc = ac.createOscillator()
    sirenOsc.type = 'square'
    sirenOsc.frequency.setValueAtTime(frightened ? 400 : BASSLINE[0], ac.currentTime)
    sirenOsc.connect(sirenGain)
    sirenOsc.start()

    sirenTick = 0
    const bpm = frightened ? 120 : 80
    const interval = (60 / bpm) * 500 // ms per 8th note

    sirenInterval = setInterval(() => {
      if (!sirenOsc || !sirenGain) return
      sirenTick = (sirenTick + 1) % BASSLINE.length
      const ac2 = getCtx()
      if (frightened) {
        // Fast alternating high/low for frightened mode
        const freq = sirenTick % 2 === 0 ? 400 : 300
        sirenOsc.frequency.setValueAtTime(freq, ac2.currentTime)
      } else {
        sirenOsc.frequency.setValueAtTime(BASSLINE[sirenTick], ac2.currentTime)
      }
    }, interval)
  } catch {}
}

export const sounds = {
  dot: () => beep(440, 0.05, 'square', 0.07),
  pellet: () => {
    beep(600, 0.08, 'square', 0.15)
    setTimeout(() => beep(900, 0.1, 'square', 0.15), 80)
  },
  eatGhost: () => {
    ;[200, 400, 700].forEach((f, i) => setTimeout(() => beep(f, 0.1, 'sawtooth', 0.2), i * 100))
  },
  death: () => {
    stopSirenLoop()
    ;[440, 415, 392, 370, 349, 330, 311, 294].forEach((f, i) =>
      setTimeout(() => beep(f, 0.12, 'sawtooth', 0.18), i * 110))
  },
  start: () => {
    ;[523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => beep(f, 0.15, 'triangle', 0.15), i * 160))
  },
  startSiren: () => startSirenLoop(false),
  startFrightenedSiren: () => startSirenLoop(true),
  stopSiren: () => stopSirenLoop(),
}
