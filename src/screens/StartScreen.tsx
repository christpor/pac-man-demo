import { useEffect, useRef, useState } from 'react'

interface Props { highScore: number; onStart: () => void }

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852']
const GHOST_NAMES = ['BLINKY', 'PINKY', 'INKY', 'CLYDE']
const W = 504, H = 200

function drawGhostSprite(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, frightened: boolean, tick: number) {
  const r = 14
  ctx.shadowBlur = 10
  ctx.shadowColor = frightened ? '#0000cc' : color
  ctx.fillStyle = frightened ? (tick % 20 < 10 ? '#0000cc' : '#fff') : color
  ctx.beginPath()
  ctx.arc(x, y, r, Math.PI, 0)
  ctx.lineTo(x + r, y + r)
  const ww = r / 2
  for (let i = 2; i >= 0; i--) ctx.arc(x - r + ww * (2 * i + 1), y + r, ww, 0, Math.PI, true)
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0
  if (!frightened) {
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(x - 5, y - 2, 4, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 5, y - 2, 4, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#00f'
    ctx.beginPath(); ctx.arc(x - 5, y - 2, 2, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 5, y - 2, 2, 0, Math.PI * 2); ctx.fill()
  }
}

function drawPacSprite(ctx: CanvasRenderingContext2D, x: number, y: number, dir: number, tick: number) {
  const r = 13
  const mouth = tick % 12 < 6 ? 0.25 : 0.02
  ctx.shadowBlur = 14
  ctx.shadowColor = '#FFD700'
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.arc(x, y, r, dir + mouth * Math.PI, dir + (2 - mouth) * Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0
}

export default function StartScreen({ highScore, onStart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [blink, setBlink] = useState(true)
  const tickRef = useRef(0)
  const rafRef = useRef(0)

  // Phase: 0=ghosts chase right, 1=pac chases ghosts left (frightened), 2=loop
  const phaseRef = useRef(0)
  const ghostsXRef = useRef([-60, -100, -140, -180])
  const pacXRef = useRef(W + 40)

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    function draw() {
      tickRef.current++
      const tick = tickRef.current
      const phase = phaseRef.current

      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, W, H)

      // Dot trail
      ctx.fillStyle = '#ffeecc'
      for (let i = 0; i < W; i += 24) {
        ctx.beginPath()
        ctx.arc(i + 12, 130, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      if (phase === 0) {
        // Ghosts march right
        ghostsXRef.current = ghostsXRef.current.map(x => x + 1.5)
        ghostsXRef.current.forEach((gx, i) => {
          drawGhostSprite(ctx, gx, 130, GHOST_COLORS[i], false, tick)
          if (gx > 20 && gx < W - 20) {
            ctx.fillStyle = GHOST_COLORS[i]
            ctx.font = 'bold 10px Arial'
            ctx.textAlign = 'center'
            ctx.fillText(GHOST_NAMES[i], gx, 155)
          }
        })
        // Pac-Man follows from left
        const pacX = ghostsXRef.current[3] - 40
        if (pacX > 0) drawPacSprite(ctx, pacX, 130, 0, tick)

        if (ghostsXRef.current[0] > W + 60) {
          phaseRef.current = 1
          ghostsXRef.current = [W + 60, W + 100, W + 140, W + 180]
          pacXRef.current = -40
        }
      } else {
        // Pac-Man chases frightened ghosts left
        ghostsXRef.current = ghostsXRef.current.map(x => x - 1.5)
        pacXRef.current += 1.8
        ghostsXRef.current.forEach((gx, i) => {
          drawGhostSprite(ctx, gx, 130, GHOST_COLORS[i], true, tick)
        })
        drawPacSprite(ctx, pacXRef.current, 130, Math.PI, tick)

        if (ghostsXRef.current[3] < -60) {
          phaseRef.current = 0
          ghostsXRef.current = [-60, -100, -140, -180]
          pacXRef.current = W + 40
        }
      }

      // Score row
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 13px Arial'
      ctx.textAlign = 'left'
      ctx.fillText('1UP', 20, 20)
      ctx.fillStyle = '#FFD700'
      ctx.fillText('00', 20, 36)
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'center'
      ctx.fillText('HIGH SCORE', W / 2, 20)
      ctx.fillStyle = '#FFD700'
      ctx.fillText(highScore > 0 ? String(highScore) : '00', W / 2, 36)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [highScore])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Enter') onStart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onStart])

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', userSelect: 'none' }}>
      {/* Neon PAC-MAN title */}
      <div style={{
        fontSize: 72, fontWeight: 900, letterSpacing: 10,
        color: '#FFD700',
        textShadow: '0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 80px #ff8800',
        padding: '32px 0 8px',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        PAC-MAN
      </div>

      {/* Animated canvas — ghost parade */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', margin: '0 auto' }}
      />

      {/* Scoring table */}
      <div style={{ color: '#fff', fontSize: 13, margin: '8px 0', lineHeight: 1.8 }}>
        <span style={{ color: '#FFD700' }}>●</span> DOT = 10 pts &nbsp;
        <span style={{ color: '#FFD700' }}>⬤</span> POWER PELLET = 50 pts &nbsp;
        <span style={{ color: '#00FFFF' }}>👻</span> GHOST = 200 pts
      </div>

      {/* Blinking press enter */}
      <div style={{
        color: blink ? '#fff' : 'transparent',
        fontSize: 22, fontWeight: 'bold',
        margin: '16px 0 8px',
        textShadow: blink ? '0 0 8px #fff' : 'none',
        transition: 'color 0.1s',
      }}>
        PRESS ENTER TO START
      </div>

      {/* Tap to start on mobile */}
      <button
        onClick={onStart}
        style={{
          marginTop: 8, padding: '12px 36px', fontSize: 16,
          background: '#FFD700', color: '#000', border: 'none',
          borderRadius: 8, cursor: 'pointer', fontWeight: 'bold',
          boxShadow: '0 0 16px #FFD700',
        }}
      >
        ▶ PLAY
      </button>

      <style>{`
        @keyframes pulse {
          0%, 100% { text-shadow: 0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 80px #ff8800; }
          50% { text-shadow: 0 0 40px #FFD700, 0 0 80px #FFD700, 0 0 120px #ff8800; }
        }
      `}</style>
    </div>
  )
}
