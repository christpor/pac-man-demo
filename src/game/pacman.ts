import { isWall, COLS } from './maze'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export interface PacMan {
  x: number
  y: number
  dir: Direction
  nextDir: Direction
  mouthOpen: boolean
}

export const PACMAN_START = { x: 10, y: 16 }

export function createPacMan(): PacMan {
  return { x: PACMAN_START.x, y: PACMAN_START.y, dir: 'LEFT', nextDir: 'LEFT', mouthOpen: true }
}

function dirDelta(dir: Direction): [number, number] {
  if (dir === 'UP') return [0, -1]
  if (dir === 'DOWN') return [0, 1]
  if (dir === 'LEFT') return [-1, 0]
  return [1, 0]
}

export function updatePacMan(pac: PacMan, maze: number[][]): PacMan {
  let { x, y, dir, nextDir, mouthOpen } = pac

  // Try to apply buffered direction
  const [ndx, ndy] = dirDelta(nextDir)
  if (!isWall(maze, x + ndx, y + ndy)) dir = nextDir

  const [dx, dy] = dirDelta(dir)
  let nx = x + dx
  let ny = y + dy

  // Tunnel wrap on row 10
  if (ny === 10) {
    if (nx < 0) nx = COLS - 1
    if (nx >= COLS) nx = 0
  }

  if (!isWall(maze, nx, ny)) {
    x = nx
    y = ny
  }

  return { x, y, dir, nextDir, mouthOpen: !mouthOpen }
}
