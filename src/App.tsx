import { useState, useCallback, useRef, useEffect } from 'react'
import { createMaze, CELL } from './game/maze'
import { createPacMan, updatePacMan } from './game/pacman'
import type { Direction, PacMan } from './game/pacman'
import { createGhosts, updateGhosts, frightenGhosts } from './game/ghost'
import type { Ghost } from './game/ghost'
import { useGameLoop } from './game/useGameLoop'
import { sounds } from './game/sounds'
import GameBoard from './components/GameBoard'
import ScoreBar from './components/ScoreBar'
import StartScreen from './screens/StartScreen'
import GameOverScreen from './screens/GameOverScreen'
import './index.css'

type Screen = 'start' | 'playing' | 'gameover'

const HS_KEY = 'pacman-high-score'
const FRUIT_POS = { x: 10, y: 16 }
const TOTAL_DOTS_INITIAL = (() => {
  const m = createMaze()
  return m.flat().filter(c => c === CELL.DOT || c === CELL.PELLET).length
})()

function getHighScore() {
  return parseInt(localStorage.getItem(HS_KEY) || '0', 10)
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [maze, setMaze] = useState(createMaze)
  const [pacman, setPacman] = useState<PacMan>(createPacMan)
  const [ghosts, setGhosts] = useState<Ghost[]>(createGhosts)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [highScore, setHighScore] = useState(getHighScore)
  const [ready, setReady] = useState(false)
  const [fruit, setFruit] = useState({ active: false, shown: false })

  const stateRef = useRef({ maze, pacman, ghosts, score, lives, fruit })
  stateRef.current = { maze, pacman, ghosts, score, lives, fruit }

  const ghostTickRef = useRef(0)
  const fruitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startGame = useCallback(() => {
    setMaze(createMaze())
    setPacman(createPacMan())
    setGhosts(createGhosts())
    setScore(0)
    setLives(3)
    setFruit({ active: false, shown: false })
    ghostTickRef.current = 0
    setReady(true)
    setScreen('playing')
    sounds.start()
    setTimeout(() => setReady(false), 2000)
  }, [])

  useEffect(() => {
    if (screen === 'playing') return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Enter') startGame() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, startGame])

  const tick = useCallback(() => {
    if (ready) return
    const { maze, pacman, ghosts, score, lives, fruit } = stateRef.current
    const dt = 100

    const newPac = updatePacMan(pacman, maze)
    const newMaze = maze.map(r => [...r])
    let newScore = score
    let newGhosts = ghosts

    // Eat dot/pellet
    const cell = newMaze[newPac.y]?.[newPac.x]
    if (cell === CELL.DOT) {
      newMaze[newPac.y][newPac.x] = CELL.EMPTY
      newScore += 10
      sounds.dot()
    } else if (cell === CELL.PELLET) {
      newMaze[newPac.y][newPac.x] = CELL.EMPTY
      newScore += 50
      newGhosts = frightenGhosts(ghosts)
      sounds.pellet()
    }

    // Fruit bonus
    const dotsLeft = newMaze.flat().filter(c => c === CELL.DOT || c === CELL.PELLET).length
    if (!fruit.shown && dotsLeft <= TOTAL_DOTS_INITIAL - 70) {
      setFruit({ active: true, shown: true })
      if (fruitTimerRef.current) clearTimeout(fruitTimerRef.current)
      fruitTimerRef.current = setTimeout(() => setFruit(f => ({ ...f, active: false })), 10000)
    }
    if (fruit.active && newPac.x === FRUIT_POS.x && newPac.y === FRUIT_POS.y) {
      newScore += 100
      sounds.pellet()
      setFruit(f => ({ ...f, active: false }))
    }

    // Move ghosts every 2nd tick
    ghostTickRef.current++
    if (ghostTickRef.current % 2 === 0) {
      newGhosts = updateGhosts(newGhosts, newMaze, newPac.x, newPac.y, dt * 2)
    }

    // Collision
    let newLives = lives
    let died = false
    newGhosts = newGhosts.map(g => {
      if (g.x === newPac.x && g.y === newPac.y) {
        if (g.mode === 'frightened') {
          newScore += 200
          sounds.eatGhost()
          return { ...g, mode: 'eaten' as const }
        } else if (g.mode !== 'eaten') {
          died = true
        }
      }
      return g
    })

    if (died) {
      sounds.death()
      newLives = lives - 1
      if (newLives <= 0) {
        const hs = Math.max(newScore, getHighScore())
        localStorage.setItem(HS_KEY, String(hs))
        setHighScore(hs)
        setScore(newScore)
        setScreen('gameover')
        return
      }
      setPacman(createPacMan())
      setGhosts(createGhosts())
      setLives(newLives)
      setScore(newScore)
      setMaze(newMaze)
      ghostTickRef.current = 0
      setReady(true)
      setTimeout(() => setReady(false), 2000)
      return
    }

    if (dotsLeft === 0) {
      setScore(newScore)
      setMaze(createMaze())
      setPacman(createPacMan())
      setGhosts(createGhosts())
      setFruit({ active: false, shown: false })
      ghostTickRef.current = 0
      setReady(true)
      setTimeout(() => setReady(false), 2000)
      return
    }

    setPacman(newPac)
    setMaze(newMaze)
    setGhosts(newGhosts)
    setScore(newScore)
  }, [ready])

  useGameLoop(tick, screen === 'playing')

  const handleDir = useCallback((dir: Direction) => {
    setPacman(p => ({ ...p, nextDir: dir }))
  }, [])

  if (screen === 'start') return <StartScreen highScore={highScore} />
  if (screen === 'gameover') return <GameOverScreen score={score} highScore={highScore} onRestart={startGame} />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <ScoreBar score={score} highScore={highScore} lives={lives} totalDots={TOTAL_DOTS_INITIAL} dotsLeft={maze.flat().filter(c => c === CELL.DOT || c === CELL.PELLET).length} />
      <div style={{ position: 'relative' }}>
        <GameBoard maze={maze} pacman={pacman} ghosts={ghosts} fruit={fruit} onDirectionChange={handleDir} />
        {ready && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#FFD700', fontSize: 28, fontWeight: 'bold',
            textShadow: '0 0 10px #FFD700'
          }}>READY!</div>
        )}
      </div>
    </div>
  )
}
