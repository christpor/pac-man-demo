export type GhostMode = 'house' | 'chase' | 'scatter' | 'frightened' | 'eaten'

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
const SCATTER_TARGETS = [
  { x: 20, y: 0 }, { x: 0, y: 0 }, { x: 20, y: 22 }, { x: 0, y: 22 }
]

export function createGhosts(): Ghost[] {
  return [0, 1, 2, 3].map(id => ({
    id,
    x: 9 + id % 3,
    y: 10,
    dir: 'LEFT' as const,
    mode: id === 0 ? 'chase' : 'house' as GhostMode,
    color: GHOST_COLORS[id],
    frightenedTimer: 0,
    houseTimer: id * 5000,
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

function chooseDir(
  ghost: Ghost,
  maze: number[][],
  targetX: number,
  targetY: number
): Ghost['dir'] {
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
    const cell = maze[ny][nx]
    if (cell === 1) continue // wall
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
    return maze[ny][nx] !== 1
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

    if (mode === 'house') {
      houseTimer -= dt
      if (houseTimer <= 0) mode = 'chase'
      else return { ...ghost, houseTimer }
    }

    if (mode === 'frightened') {
      frightenedTimer -= dt
      if (frightenedTimer <= 0) mode = 'chase'
    }

    if (mode === 'eaten') {
      // Return to house center
      const tx = 10, ty = 10
      if (x === tx && y === ty) { mode = 'chase' }
      else dir = chooseDir(ghost, maze, tx, ty)
    } else if (mode === 'frightened') {
      dir = randomDir(ghost, maze)
    } else if (mode === 'chase') {
      dir = chooseDir(ghost, maze, pacX, pacY)
    } else if (mode === 'scatter') {
      const t = SCATTER_TARGETS[ghost.id]
      dir = chooseDir(ghost, maze, t.x, t.y)
    }

    const [dx, dy] = dirDelta(dir)
    const nx = x + dx
    const ny = y + dy
    if (ny >= 0 && ny < maze.length && nx >= 0 && nx < maze[0].length && maze[ny][nx] !== 1) {
      x = nx; y = ny
    } else {
      // Pick any valid direction
      dir = randomDir(ghost, maze)
      const [dx2, dy2] = dirDelta(dir)
      const nx2 = x + dx2, ny2 = y + dy2
      if (ny2 >= 0 && ny2 < maze.length && nx2 >= 0 && nx2 < maze[0].length && maze[ny2][nx2] !== 1) {
        x = nx2; y = ny2
      }
    }

    return { ...ghost, x, y, dir, mode, frightenedTimer, houseTimer }
  })
}

export function frightenGhosts(ghosts: Ghost[]): Ghost[] {
  return ghosts.map(g =>
    g.mode !== 'eaten' && g.mode !== 'house'
      ? { ...g, mode: 'frightened' as GhostMode, frightenedTimer: 8000 }
      : g
  )
}
