import { useEffect, useRef, useCallback } from 'react'
import { CELL, CELL_SIZE, COLS, ROWS } from '../game/maze'
import type { PacMan, Direction } from '../game/pacman'
import type { Ghost } from '../game/ghost'

interface Props {
  maze: number[][]
  pacman: PacMan
  ghosts: Ghost[]
  fruit: { active: boolean }
  onDirectionChange: (dir: Direction) => void
}

function drawMaze(ctx: CanvasRenderingContext2D, maze: number[][], tick: number) {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE)

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = maze[y][x]
      const px = x * CELL_SIZE
      const py = y * CELL_SIZE
      const cx = px + CELL_SIZE / 2
      const cy = py + CELL_SIZE / 2

      if (cell === CELL.WALL) {
        ctx.shadowBlur = 8
        ctx.shadowColor = '#4444ff'
        ctx.fillStyle = '#1a1aff'
        ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2)
        ctx.shadowBlur = 0
      } else if (cell === CELL.DOT) {
        ctx.fillStyle = '#ffeecc'
        ctx.beginPath()
        ctx.arc(cx, cy, 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (cell === CELL.PELLET) {
        ctx.shadowBlur = 12
        ctx.shadowColor = '#ffeecc'
        ctx.fillStyle = '#ffeecc'
        ctx.beginPath()
        ctx.arc(cx, cy, tick % 2 === 0 ? 5 : 6, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      } else if (cell === CELL.HOUSE) {
        ctx.fillStyle = '#111'
        ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE)
      }
    }
  }
}

function drawPacMan(ctx: CanvasRenderingContext2D, pac: PacMan, tick: number) {
  const cx = pac.x * CELL_SIZE + CELL_SIZE / 2
  const cy = pac.y * CELL_SIZE + CELL_SIZE / 2
  const r = CELL_SIZE / 2 - 2
  const rotMap: Record<Direction, number> = { RIGHT: 0, DOWN: 0.5, LEFT: 1, UP: 1.5 }
  const rot = rotMap[pac.dir] * Math.PI
  const mouthAngle = tick % 2 === 0 ? 0.25 : 0.05

  ctx.shadowBlur = 16
  ctx.shadowColor = '#FFD700'
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.arc(cx, cy, r, rot + mouthAngle * Math.PI, rot + (2 - mouthAngle) * Math.PI)
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0
}

function drawGhost(ctx: CanvasRenderingContext2D, ghost: Ghost, tick: number) {
  const cx = ghost.x * CELL_SIZE + CELL_SIZE / 2
  const cy = ghost.y * CELL_SIZE + CELL_SIZE / 2
  const r = CELL_SIZE / 2 - 2

  if (ghost.mode === 'eaten') {
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(cx - 3, cy - 2, 3, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + 3, cy - 2, 3, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#00f'
    ctx.beginPath(); ctx.arc(cx - 3, cy - 2, 1.5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + 3, cy - 2, 1.5, 0, Math.PI * 2); ctx.fill()
    return
  }

  let bodyColor: string
  if (ghost.mode === 'frightened') {
    const flash = ghost.frightenedTimer < 3000 && tick % 4 < 2
    bodyColor = flash ? '#fff' : '#0000cc'
    ctx.shadowColor = '#0000cc'
  } else {
    bodyColor = ghost.color
    ctx.shadowColor = ghost.color
  }

  ctx.shadowBlur = 12
  ctx.fillStyle = bodyColor
  ctx.beginPath()
  ctx.arc(cx, cy - 1, r, Math.PI, 0)
  ctx.lineTo(cx + r, cy + r)
  const waveW = r / 2
  for (let i = 2; i >= 0; i--) {
    ctx.arc(cx - r + waveW * (2 * i + 1), cy + r, waveW, 0, Math.PI, true)
  }
  ctx.closePath()
  ctx.fill()
  ctx.shadowBlur = 0

  if (ghost.mode !== 'frightened') {
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(cx - 3, cy - 3, 3, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + 3, cy - 3, 3, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#00f'
    ctx.beginPath(); ctx.arc(cx - 3, cy - 3, 1.5, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + 3, cy - 3, 1.5, 0, Math.PI * 2); ctx.fill()
  }
}

function drawFruit(ctx: CanvasRenderingContext2D) {
  const fx = 10 * CELL_SIZE + CELL_SIZE / 2
  const fy = 16 * CELL_SIZE + CELL_SIZE / 2
  ctx.shadowBlur = 10
  ctx.shadowColor = '#ff0000'
  ctx.fillStyle = '#ff3333'
  ctx.beginPath()
  ctx.arc(fx, fy, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0
  ctx.strokeStyle = '#00aa00'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(fx, fy - 6)
  ctx.lineTo(fx + 3, fy - 10)
  ctx.stroke()
}

export default function GameBoard({ maze, pacman, ghosts, fruit, onDirectionChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tickRef = useRef(0)

  const handleKey = useCallback((e: KeyboardEvent) => {
    const map: Record<string, Direction> = {
      ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT'
    }
    if (map[e.key]) { e.preventDefault(); onDirectionChange(map[e.key]) }
  }, [onDirectionChange])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    tickRef.current++
    drawMaze(ctx, maze, tickRef.current)
    drawPacMan(ctx, pacman, tickRef.current)
    ghosts.forEach(g => drawGhost(ctx, g, tickRef.current))
    if (fruit.active) drawFruit(ctx)
  })

  return (
    <canvas
      ref={canvasRef}
      width={COLS * CELL_SIZE}
      height={ROWS * CELL_SIZE}
      style={{ display: 'block' }}
    />
  )
}
