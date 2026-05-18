export type GhostMode = 'house' | 'exiting' | 'chase' | 'scatter' | 'frightened' | 'eaten'

export interface Ghost {
  id: number
  x: number
  y: number
  dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  mode: GhostMode
  color: string
  frightenedTimer: number
  houseTimer: number
}

const GHOST_COLORS = ['#FF0000', '#FFB8FF', '#00FFFF', '#FFB852']
const GHOST_NAMES = ['BLINKY', 'PINKY', 'INKY', 'CLYDE']
export { GHOST_NAMES }

const SCATTER_TARGETS = [
  { x: 20, y: 0 }, { x: 0, y: 0 }, { x: 20, y: 22 }, { x: 0, y: 22 }
]

// Ghost 0 (Blinky) starts outside the house, others inside
const GHOST_STARTS = [
  { x: 10, y: 8 },  // Blinky — outside, starts chasing immediately
  { x: 9,  y: 10 }, // Pinky
  { x: 10, y: 10 }, // Inky
  { x: 11, y: 10 }, // Clyde
]

export function createGhosts(): Ghost[] {
  return [0, 1, 2, 3].map(id => ({
    id,
    x: GHOST_STARTS[id].x,
    y: GHOST_STARTS[id].y,
    dir: 'LEFT' as const,
    mode: id === 0 ? 'chase' : 'house' as GhostMode,
    color: GHOST_COLORS[id],
    frightenedTimer: 0,
    houseTimer: id * 5000, // 0, 5s, 10s, 15s
  }))
}

function dirDelta(dir: Ghost['dir']): [number, number] {
  if (dir === 'UP') return [0, -1]
  if (dir === 'DOWN') return [0, 1]
  if (dir === 'LEFT') return [-1, 0]
  return [1, 0]
}

function opposite(dir: Ghost['dir']): Ghost['dir'] {
  if (dir === 'UP') return 'DOWN'
  if (dir === 'DOWN') return 'UP'
  if (dir === 'LEFT') return 'RIGHT'
  return 'LEFT'
}

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.abs(ax - bx) + Math.abs(ay - by)
}

function chooseDir(ghost: Ghost, maze: number[][], targetX: number, targetY: number): Ghost['dir'] {
  const dirs: Ghost['dir'][] = ['UP', 'DOWN', 'LEFT', 'RIGHT']
  const opp = opposite(ghost.dir)
  let best: Ghost['dir'] = ghost.dir
  let bestDist = Infinity

  for (const d of dirs) {
    if (d === opp) continue
    const [dx, dy] = dirDelta(d)
    const nx = ghost.x + dx
    const ny = ghost.y + dy
    if (ny < 0 || ny >= maze.length || nx < 0 || nx >= maze[0].length) continue
    if (maze[ny][nx] === 1) continue
    if (maze[ny][nx] === 4 && ghost.mode !== 'eaten' && ghost.mode !== 'house' && ghost.mode !== 'exiting') continue
    const d2 = dist(nx, ny, targetX, targetY)
    if (d2 < bestDist) { bestDist = d2; best = d }
  }
  return best
}

function randomDir(ghost: Ghost, maze: number[][]): Ghost['dir'] {
  const dirs: Ghost['dir'][] = ['UP', 'DOWN', 'LEFT', 'RIGHT']
  const opp = opposite(ghost.dir)
  const valid = dirs.filter(d => {
    if (d === opp) return false
    const [dx, dy] = dirDelta(d)
    const nx = ghost.x + dx
    const ny = ghost.y + dy
    if (ny < 0 || ny >= maze.length || nx < 0 || nx >= maze[0].length) return false
    if (maze[ny][nx] === 1) return false
    if (maze[ny][nx] === 4 && ghost.mode !== 'eaten' && ghost.mode !== 'house' && ghost.mode !== 'exiting') return false
    return true
  })
  return valid.length ? valid[Math.floor(Math.random() * valid.length)] : ghost.dir
}

export function updateGhosts(
  ghosts: Ghost[],
  maze: number[][],
  pacX: number,
  pacY: number,
  dt: number
): Ghost[] {
  return ghosts.map(ghost => {
    let { x, y, dir, mode, frightenedTimer, houseTimer } = ghost

    // House: wait then start exiting
    if (mode === 'house') {
      houseTimer -= dt
      if (houseTimer <= 0) mode = 'exiting'
      else return { ...ghost, houseTimer }
    }

    // Exiting: move UP to y=8 (exit point), then start chasing
    if (mode === 'exiting') {
      if (y > 8) {
        dir = 'UP'
        const ny = y - 1
        if (maze[ny]?.[x] !== 1) y = ny
      } else {
        x = 10 // center on exit column
        mode = 'chase'
      }
      return { ...ghost, x, y, dir, mode, houseTimer }
    }

    if (mode === 'frightened') {
      frightenedTimer -= dt
      if (frightenedTimer <= 0) mode = 'chase'
    }

    const currentGhostState = { ...ghost, x, y, dir, mode }

    if (mode === 'eaten') {
      const tx = 10, ty = 10
      if (x === tx && y === ty) { mode = 'chase' }
      else dir = chooseDir(currentGhostState, maze, tx, ty)
    } else if (mode === 'frightened') {
      dir = randomDir(currentGhostState, maze)
    } else if (mode === 'chase') {
      // Clyde flees when within 8 cells
      if (ghost.id === 3 && dist(x, y, pacX, pacY) < 8) {
        const t = SCATTER_TARGETS[ghost.id]
        dir = chooseDir(currentGhostState, maze, t.x, t.y)
      } else {
        dir = chooseDir(currentGhostState, maze, pacX, pacY)
      }
    } else if (mode === 'scatter') {
      const t = SCATTER_TARGETS[ghost.id]
      dir = chooseDir(currentGhostState, maze, t.x, t.y)
    }

    const isPassable = (cx: number, cy: number) => {
      if (cy < 0 || cy >= maze.length || cx < 0 || cx >= maze[0].length) return false
      if (maze[cy][cx] === 1) return false
      if (maze[cy][cx] === 4 && mode !== 'eaten' && mode !== 'house' && mode !== 'exiting') return false
      return true
    }

    const [dx, dy] = dirDelta(dir)
    const nx = x + dx
    const ny = y + dy
    if (isPassable(nx, ny)) {
      x = nx; y = ny
    } else {
      dir = randomDir({ ...currentGhostState, mode, dir }, maze)
      const [dx2, dy2] = dirDelta(dir)
      const nx2 = x + dx2, ny2 = y + dy2
      if (isPassable(nx2, ny2)) {
        x = nx2; y = ny2
      }
    }

    return { ...ghost, x, y, dir, mode, frightenedTimer, houseTimer }
  })
}

export function frightenGhosts(ghosts: Ghost[]): Ghost[] {
  return ghosts.map(g =>
    g.mode !== 'eaten' && g.mode !== 'house' && g.mode !== 'exiting'
      ? { ...g, mode: 'frightened' as GhostMode, frightenedTimer: 8000 }
      : g
  )
}
