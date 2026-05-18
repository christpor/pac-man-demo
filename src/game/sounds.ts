// Web Audio API sounds — no files needed
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
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
    ;[440, 415, 392, 370, 349, 330, 311, 294].forEach((f, i) =>
      setTimeout(() => beep(f, 0.12, 'sawtooth', 0.18), i * 110))
  },
  start: () => {
    ;[523, 659, 784, 1047].forEach((f, i) =>
      setTimeout(() => beep(f, 0.15, 'triangle', 0.15), i * 160))
  },
}
